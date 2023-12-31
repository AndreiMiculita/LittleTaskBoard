from flask import Blueprint, request, flash, g

from .auth import login_required
from .db import get_db
# from .models import Task

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
    return tasks, 200

@bp.route('/<int:id>', methods=['GET'])
@login_required
def get_task(id):
    db = get_db()
    task = db.execute(
        'SELECT * FROM task WHERE id = ?',
        (id,)
    ).fetchone()
    return task, 200


# Example data: {"title":"Test","priority":"1","plannedAt":"2023-12-12T10:10","duration":"10"}
@bp.route('/create', methods=['POST'])
@login_required
def create():
    data = request.get_json()
    title = data['title']
    priority = data['priority']
    planned_at = data['plannedAt']
    duration = data['duration']
    error = None

    if not title:
        return 'Title is required.', 400
    
    if error is not None:
        flash(error)
    else:
        db = get_db()
        db.execute(
            'INSERT INTO task (title, author_id, priority, planned_at, duration, status)'
            ' VALUES (?, ?, ?, ?, ?, ?)',
            (title, g.user['id'], priority, planned_at, duration, 0)
        )
        db.commit()
        return 'Task created successfully.', 200
    
    return 'Something went wrong.', 500

@bp.route('/<int:id>/update', methods=['POST'])
@login_required
def update(id):
    data = request.get_json()
    title = data['title']
    priority = data['priority']
    planned_at = data['plannedAt']
    duration = data['duration']
    status = data['status']
    error = None

    if not title:
        return 'Title is required.', 400
    
    if error is not None:
        flash(error)
    else:
        db = get_db()
        db.execute(
            'UPDATE task SET title = ?, priority = ?, planned_at = ?, duration = ?, status = ?'
            ' WHERE id = ?',
            (title, priority, planned_at, duration, status, id)
        )
        db.commit()
        return 'Task updated successfully.', 200
    
    return 'Something went wrong.', 500


@bp.route('/<int:id>/delete', methods=['POST'])
@login_required
def delete(id):
    db = get_db()
    db.execute('DELETE FROM task WHERE id = ?', (id,))
    db.commit()
    return 'Task deleted successfully.', 200

