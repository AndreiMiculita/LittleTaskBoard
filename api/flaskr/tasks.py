import time
from flask import Blueprint, request, flash, g, jsonify

from .auth import login_required
from .db import get_db
from datetime import datetime

bp = Blueprint('tasks', __name__)


@bp.route('/', methods=['GET'])
@login_required
def get_tasks():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status', type=int)
    db = get_db()
    if status is not None:
        tasks = db.execute(
            'SELECT * FROM task WHERE author_id = ? AND status = ? ORDER BY priority ASC, status ASC LIMIT ? OFFSET ?',
            (g.user['id'], status, per_page, (page - 1) * per_page)
        ).fetchall()
    else:
        tasks = db.execute(
            'SELECT * FROM task WHERE author_id = ? ORDER BY priority ASC, status ASC LIMIT ? OFFSET ?',
            (g.user['id'], per_page, (page - 1) * per_page)
        ).fetchall()
    tasks = [dict(task) for task in tasks]
    for task in tasks:
        if task['planned_at'] is not None:
            task['planned_at'] = datetime.fromtimestamp(task['planned_at']).strftime('%Y-%m-%dT%H:%M:%S')
    return jsonify(tasks), 200

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
        task['planned_at'] = datetime.fromtimestamp(task['planned_at']).strftime('%Y-%m-%dT%H:%M:%S')
        return jsonify(task), 200
    
    return 'Something went wrong.', 500


# Example data: {"title":"Test","priority":"1","plannedAt":"2023-12-12T10:10","duration":"10"}
@bp.route('/create', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    title = data['title']
    priority = data['priority']
    planned_at = data['plannedAt']
    duration = data['duration']
    
    planned_at_datetime = datetime.strptime(planned_at, '%Y-%m-%dT%H:%M')
    planned_at_unix = int(time.mktime(planned_at_datetime.timetuple()))

    if not title:
        return 'Title is required.', 400
    
    db = get_db()
    db.execute(
        'INSERT INTO task (title, author_id, priority, planned_at, duration, status)'
        ' VALUES (?, ?, ?, ?, ?, ?)',
        (title, g.user['id'], priority, planned_at_unix, duration, 0)
    )
    db.commit()
    return 'Task created successfully.', 200



@bp.route('/<int:id>/delete', methods=['POST'])
@login_required
def delete(id):
    db = get_db()
    db.execute('DELETE FROM task WHERE id = ?', (id,))
    db.commit()
    return 'Task deleted successfully.', 200

