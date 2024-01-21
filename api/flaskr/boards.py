from datetime import datetime

from flask import (Blueprint, g, jsonify)

from .auth import login_required
from .db import get_db

bp = Blueprint('boards', __name__)


@bp.route('/', methods=['GET'])
@login_required
def get_board():
    """
    Get a task board. Should maybe be refactored to have separate API calls for each column.

    Returns:
        200: board
    """

    statuses = {
        1: 'To do',
        2: 'In progress',
        3: 'Done'
    }

    db = get_db()
    tasks = db.execute(
        'SELECT * FROM task WHERE author_id = ? ORDER BY priority ASC, status ASC',
        (g.user['id'],)
    ).fetchall()

    # Group tasks by status
    grouped_tasks = {}
    for task in tasks:
        if task['status'] not in grouped_tasks:
            grouped_tasks[task['status']] = []
        grouped_tasks[task['status']].append(task)

    board_response = {
        'columns': []
    }

    for status_id, status_title in statuses.items():
        column = {
            'id': status_id,
            'title': status_title,
            'tasks': []
        }
        if status_id in grouped_tasks:
            for task in grouped_tasks[status_id]:
                column['tasks'].append({
                    'id': task['id'],
                    'title': task['title'],
                    'priority': task['priority'],
                    'planned_at': datetime.fromtimestamp(task['planned_at']).strftime('%Y-%m-%dT%H:%M:%S') if task['planned_at'] else None,
                    'duration': task['duration']
                })
        board_response['columns'].append(column)

    return jsonify(board_response), 200
