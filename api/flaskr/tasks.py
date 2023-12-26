from flask import Blueprint, request, flash

from .db import get_db
# from .models import Task

bp = Blueprint('tasks', __name__)

# Example data: {"title":"Test","priority":"1","plannedAt":"2023-12-12T10:10","duration":"10"}
@bp.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    title = data['title']
    priority = data['priority']
    plannedAt = data['plannedAt']
    duration = data['duration']
    error = None

    if not title:
        return 'Title is required.', 400
    
    if error is not None:
        flash(error)
    else:
        db = get_db()
        db.execute(
            'INSERT INTO tasks (title, priority, plannedAt, duration)'
            ' VALUES (?, ?, ?, ?)',
            (title, priority, plannedAt, duration)
        )
        db.commit()
        return 'Task created successfully.', 200
