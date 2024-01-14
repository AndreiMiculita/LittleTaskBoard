from datetime import datetime, timedelta

from flask import Blueprint, g, jsonify, request

from .auth import login_required
from .db import get_db
from .tasks import parse_date_to_timestamp

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


@bp.route('/types', methods=['GET'])
@login_required
def get_tasks_by_type():
    """
    Get the share of tasks for each type (the task_type column). The names of the types are in the table task_type.
    The names of the types are in the table task_type.
    """

    db = get_db()
    all_tasks = db.execute(
        'SELECT * FROM task WHERE author_id = ? ORDER BY priority ASC, status ASC',
        (g.user['id'],)
    ).fetchall()

    task_types = db.execute('SELECT * FROM task_type').fetchall()

    task_counts = [
        {
            'id': task_type['id'],
            'title': task_type['name'],
            'count': len([task for task in all_tasks if task['task_type'] == task_type['id']])
        } for task_type in task_types
    ]

    # Return the number of tasks in each type
    return jsonify({'types': task_counts}), 200


@bp.route('/types_over_time', methods=['GET'])
@login_required
def get_tasks_by_type_over_time():
    """
    Get the number of tasks of each type (the task_type column) planned for each day in a given period of time.
    """
    now = datetime.now()
    a_week_ago = now - timedelta(days=7)

    start_date = parse_date_to_timestamp(request.args.get('start_date'))
    end_date = parse_date_to_timestamp(request.args.get('end_date'))

    if start_date is None:
        start_date = a_week_ago.timestamp()
    if end_date is None:
        end_date = now.timestamp()

    db = get_db()
    tasks = db.execute(
        'SELECT * FROM task WHERE author_id = ? AND planned_at >= ? AND planned_at <= ? ORDER BY planned_at ASC',
        (g.user['id'], start_date, end_date)
    ).fetchall()

    task_types = db.execute('SELECT * FROM task_type').fetchall()

    task_counts = [
        {
            'id': task_type['id'],
            'title': task_type['name'],
            'counts': [
                {
                    'date': (datetime.fromtimestamp(planned_at) - timedelta(hours=5)).strftime('%Y-%m-%dT%H:%M:%S'),
                    'count': len([task for task in tasks if task['task_type'] == task_type['id'] and task['planned_at'] == planned_at])
                } for planned_at in range(int(start_date), int(end_date), 86400)
            ]
        } for task_type in task_types
    ]
    
    return jsonify({'types': task_counts}), 200
