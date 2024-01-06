import time
from flask import Blueprint, request, flash, g, jsonify

from .auth import login_required
from .db import get_db
from datetime import datetime

bp = Blueprint('tasks', __name__)

class ValidationError(Exception):
    def __init__(self, message, status_code):
        super().__init__(message)
        self.status_code = status_code

def validate_and_convert(data, key, min_val=None, max_val=None):
    value = data.get(key)
    if value is not None:
        if value == '':
            value = None
        else:
            try:
                value = int(value)
                if min_val is not None and value < min_val:
                    raise ValidationError(f'{key.capitalize()} must be greater than or equal to {min_val}.', 400)
                if max_val is not None and value > max_val:
                    raise ValidationError(f'{key.capitalize()} must be less than or equal to {max_val}.', 400)
            except ValueError:
                raise ValidationError(f'{key.capitalize()} must be a valid integer.', 400)
    return value

def parse_date_to_timestamp(date_str):
    if date_str is not None and date_str != '':
        try:
            date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M')
            return int(time.mktime(date.timetuple()))
        except ValueError:
            raise ValidationError('Invalid date format. Use YYYY-MM-DDTHH:MM.', 400)
    return None

@bp.route('/', methods=['GET', 'POST'])
@login_required
def get_tasks():
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data.get('title'):
                raise ValidationError('Title is required.', 400)
            priority = validate_and_convert(data, 'priority', 1, 4)
            task_type = validate_and_convert(data, 'type', 0, 2)
            duration = validate_and_convert(data, 'duration', 0)
            planned_at = parse_date_to_timestamp(data.get('plannedAt'))
        except ValidationError as e:
            return str(e), e.status_code
        db = get_db()
        db.execute(
            'INSERT INTO task (title, priority, type, planned_at, duration, author_id, status)'
            ' VALUES (?, ?, ?, ?, ?, ?, ?)',
            (data.get('title'), priority, task_type, planned_at, duration, g.user['id'], 0)
        )
        db.commit()
        return 'Task created successfully.', 201
    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', type=int)
        planned = request.args.get('planned', type=str)
        
        db = get_db()
        query = 'SELECT * FROM task WHERE author_id = ?'
        params = [g.user['id']]
        
        if planned is not None:
            planned = planned.lower() == 'true'
            query += ' AND (planned_at IS NOT NULL)' if planned else ' AND (planned_at IS NULL)'
        if status is not None:
            query += ' AND status = ?'
            params.append(status)
        
        query += ' ORDER BY priority ASC, status ASC LIMIT ? OFFSET ?'
        params.extend([per_page, (page - 1) * per_page])
        
        tasks = db.execute(query, params).fetchall()
        
        tasks = [dict(task) for task in tasks]
        for task in tasks:
            if task['planned_at'] is not None:
                task['planned_at'] = datetime.fromtimestamp(task['planned_at']).strftime('%Y-%m-%dT%H:%M:%S')
        return jsonify(tasks), 200
    else:
        return 'Method not allowed.', 405

@bp.route('/<int:id>', methods=['GET', 'PATCH'])
@login_required
def get_task(id):
    if request.method == 'PATCH':
        # Check if task exists
        db = get_db()
        task = db.execute(
            'SELECT * FROM task WHERE id = ?',
            (id,)
        ).fetchone()
        if task is None:
            return 'Task not found.', 404
        data = request.get_json()
        attributes = ['title', 'priority', 'plannedAt', 'duration', 'status']
        updates = {attr: data.get(attr) for attr in attributes if data.get(attr) is not None}
        
        if 'title' in updates and not updates['title']:
            return 'Title is required.', 400
            
        db = get_db()
        for attr, value in updates.items():
            db.execute(f"UPDATE task SET {attr} = ? WHERE id = ?", (value, id))
        db.commit()
        
        return 'Task updated successfully.', 200
        
    elif request.method == 'GET':
        db = get_db()
        task = db.execute(
            'SELECT * FROM task WHERE id = ?',
            (id,)
        ).fetchone()
        task = dict(task)
        if task['planned_at'] is not None:
            task['planned_at'] = datetime.fromtimestamp(task['planned_at']).strftime('%Y-%m-%dT%H:%M:%S')
        return jsonify(task), 200
    return 'Something went wrong.', 500


@bp.route('/<int:id>/delete', methods=['POST'])
@login_required
def delete(id):
    db = get_db()
    db.execute('DELETE FROM task WHERE id = ?', (id,))
    db.commit()
    return 'Task deleted successfully.', 200

