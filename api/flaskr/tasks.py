from flask import Blueprint, request, flash, g

from .auth import login_required
from .db import get_db
# from .models import Task

bp = Blueprint('tasks', __name__)

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
