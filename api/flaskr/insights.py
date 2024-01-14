from flask import (
    Blueprint, g, jsonify
)

from .auth import login_required
from .db import get_db

bp = Blueprint('insights', __name__)


@bp.route('/status', methods=['GET'])
@login_required
def get_task_status_stats():
    """
    Return the number of tasks in each status
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

    # Return the number of tasks in each status
    return jsonify({
        'statuses': [
            {
                'id': status_id,
                'title': status_title,
                'count': len([task for task in tasks if task['status'] == status_id])
            } for status_id, status_title in statuses.items()
        ]
    }), 200


@bp.route('/focus', methods=['GET'])
@login_required
def get_focused_tasks():
    """
    Get the share of tasks that require focus (the focus column)
    """

    db = get_db()
    all_tasks = db.execute(
        'SELECT * FROM task WHERE author_id = ? ORDER BY priority ASC, status ASC',
        (g.user['id'],)
    ).fetchall()
    focus_tasks = db.execute(
        'SELECT * FROM task WHERE author_id = ? AND focus = 1 ORDER BY priority ASC, status ASC',
        (g.user['id'],)
    ).fetchall()

    return jsonify({
        'focus': len(focus_tasks),
        'total': len(all_tasks)
    }), 200


@bp.route('/focus_over_time', methods=['GET'])
@login_required
def get_focus_over_time():
    """
    Get the share of tasks that require focus (the focus column) over time
    """

    db = get_db()
    all_tasks = db.execute(
        'SELECT * FROM task WHERE author_id = ? ORDER BY priority ASC, status ASC',
        (g.user['id'],)
    ).fetchall()
    focus_tasks = db.execute(
        'SELECT * FROM task WHERE author_id = ? AND focus = 1 ORDER BY priority ASC, status ASC',
        (g.user['id'],)
    ).fetchall()

    return jsonify({
        'focus': len(focus_tasks),
        'total': len(all_tasks)
    }), 200
