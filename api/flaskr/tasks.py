import time
from flask import Blueprint, request, g, jsonify

from .auth import login_required
from .db import get_db
from datetime import datetime
from typing import Union

bp = Blueprint('tasks', __name__)


class ValidationError(Exception):
    """Exception raised for errors in the request data."""

    def __init__(self, message, status_code):
        super().__init__(message)
        self.status_code = status_code


def validate_and_convert(data: dict, key: str, min_val: Union[int, None] = None, max_val: Union[int, None] = None):
    """
    Validate and convert a value from the request data. If the value is not present, return None.
    Note: if the value is present but empty, it will be converted to None. This is something to keep in mind.

    Args:
        data: request data
        key: key to validate
        min_val: minimum value
        max_val: maximum value
    Returns:
        value: validated and converted value
    """
    value = data.get(key)
    if value is not None:
        if value == '':
            value = None
        else:
            try:
                value = int(value)
                if min_val is not None and value < min_val:
                    raise ValidationError(
                        f'{key.capitalize()} must be greater than or equal to {min_val}.', 400)
                if max_val is not None and value > max_val:
                    raise ValidationError(
                        f'{key.capitalize()} must be less than or equal to {max_val}.', 400)
            except ValueError:
                raise ValidationError(
                    f'{key.capitalize()} must be a valid integer.', 400)
    return value


def parse_date_to_timestamp(date_str):
    """Parse a date string to a UNIX timestamp. We want to use timestamps because they are timezone-agnostic."""
    if date_str is not None and date_str != '':
        try:
            date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M')
            return int(time.mktime(date.timetuple()))
        except ValueError:
            raise ValidationError(
                'Invalid date format. Use YYYY-MM-DDTHH:MM.', 400)
    return None


@bp.route('/', methods=['GET'])
@login_required
def get_tasks():
    """
    Get all tasks (filtered by query parameters).

    Query parameters:
        q: search query
        page: page number
        per_page: number of tasks per page
        status: task status
        planned: whether task is planned
        sort_by: sort tasks by this column
        sort_direction: sort direction (asc or desc)

    Returns:
        200: list of tasks
        400: invalid request
        405: method not allowed
    """
    if request.method == 'GET':
        q = request.args.get('q', type=str)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', type=int)
        planned = request.args.get('planned', type=str)
        sort_by = request.args.get('sort_by', 'priority', type=str)
        sort_direction = request.args.get('sort_direction', 'desc', type=str)

        db = get_db()
        query = 'SELECT * FROM task WHERE author_id = ?'
        params = [g.user['id']]

        if q is not None:
            query += ' AND title LIKE ?'
            params.append('%' + q + '%')

        if planned is not None:
            planned = planned.lower() == 'true'
            query += ' AND (planned_at IS NOT NULL)' if planned else ' AND (planned_at IS NULL)'
        if status is not None:
            query += ' AND status = ?'
            params.append(status)

        if sort_by in ['status', 'priority', 'type', 'planned_at', 'duration']:
            query += f' ORDER BY {sort_by} {sort_direction.upper()}'

        query += ' LIMIT ? OFFSET ?'
        params.extend([per_page, (page - 1) * per_page])

        tasks = db.execute(query, params).fetchall()

        tasks = [dict(task) for task in tasks]
        for task in tasks:
            if task['planned_at'] is not None:
                task['planned_at'] = datetime.fromtimestamp(
                    task['planned_at']).strftime('%Y-%m-%dT%H:%M:%S')
        return jsonify(tasks), 200
    else:
        return 'Method not allowed.', 405


@bp.route('/', methods=['POST'])
@login_required
def add_task():
    """
    Create a new task.

    Returns:
        201: task created successfully
        400: invalid request
        405: method not allowed
    """
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data.get('title'):
                raise ValidationError('Title is required.', 400)
            priority = validate_and_convert(data, 'priority', 1, 4)
            task_type = validate_and_convert(data, 'type', 0, 2)
            planned_at = parse_date_to_timestamp(data.get('plannedAt'))
            duration = validate_and_convert(data, 'duration', 0)
            end = parse_date_to_timestamp(data.get('end'))

            if duration is not None and end is not None:
                raise ValidationError(
                    'Specify either duration or end, not both.', 400)

            if end is not None:
                if planned_at is None:
                    raise ValidationError(
                        'plannedAt is required when specifying end.', 400)
                elif planned_at > end:
                    raise ValidationError(
                        'End must be greater than plannedAt.', 400)
                duration = end - planned_at

        except ValidationError as e:
            return str(e), e.status_code
        db = get_db()
        db.execute(
            'INSERT INTO task (title, priority, task_type, planned_at, duration, author_id, status)'
            ' VALUES (?, ?, ?, ?, ?, ?, ?)',
            (data.get('title'), priority, task_type,
             planned_at, duration, g.user['id'], 0)
        )
        db.commit()
        return 'Task created successfully.', 201
    else:
        return 'Method not allowed.', 405


@bp.route('/<int:id>', methods=['GET'])
@login_required
def get_task(id):
    """ Get a task by ID.

    Returns:
        200: task
        404: task not found
    """
    db = get_db()
    task = db.execute(
        'SELECT * FROM task WHERE id = ?',
        (id,)
    ).fetchone()
    if task is None or task['author_id'] != g.user['id']:
        return 'Task not found.', 404
    task = dict(task)
    if task['planned_at'] is not None:
        task['planned_at'] = datetime.fromtimestamp(
            task['planned_at']).strftime('%Y-%m-%dT%H:%M:%S')
    return jsonify(task), 200


@bp.route('/<int:id>', methods=['PATCH'])
@login_required
def update_task(id):
    """ Update a task by ID.

    Returns:
        200: task updated successfully
        400: invalid request
        404: task not found
    """
    # Check if task exists
    db = get_db()
    task = db.execute(
        'SELECT * FROM task WHERE id = ?',
        (id,)
    ).fetchone()
    if task is None or task['author_id'] != g.user['id']:
        return 'Task not found.', 404
    data = request.get_json()
    title = data.get('title') or None
    priority = validate_and_convert(data, 'priority', 1, 4)
    task_type = validate_and_convert(data, 'type', 0, 2)
    planned_at = parse_date_to_timestamp(data.get('planned_at'))
    duration = validate_and_convert(data, 'duration', 0)
    end = parse_date_to_timestamp(data.get('end'))

    updates = {
        'title': title,
        'priority': priority,
        'task_type': task_type,
        'planned_at': planned_at,
        'duration': duration,
        'end': end
    }

    if duration is not None and end is not None:
        return 'Specify either duration or end, not both.', 400

    if end is not None:
        if planned_at is None:
            return 'plannedAt is required when specifying end.', 400
        elif planned_at > end:
            return 'End must be greater than plannedAt.', 400
        # Convert UNIX timestamps to minutes
        updates['duration'] = (end - planned_at) // 60
        # Remove 'end' key from updates, as it is not a column in the database
        updates.pop('end')

    db = get_db()
    for attr, value in updates.items():
        if value is not None:  # TODO: allow setting values to None
            db.execute(
                f"UPDATE task SET {attr} = ? WHERE id = ?", (value, id))
    db.commit()

    return 'Task updated successfully.', 200


@bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_task(id):
    """ Delete a task by ID.

    Returns:
        200: task deleted successfully
        404: task not found
    """
    task = get_db().execute(
        'SELECT * FROM task WHERE id = ?', (id,)
    ).fetchone()
    if task is None or task['author_id'] != g.user['id']:
        return 'Task not found.', 404
    db = get_db()
    db.execute('DELETE FROM task WHERE id = ?', (id,))
    db.commit()
    return 'Task deleted successfully.', 200


@bp.route('/<int:id>/comments', methods=['POST'])
@login_required
def add_comment(id):
    """ Add a comment to a task by ID.

    Returns:
        201: comment added successfully
        400: invalid request
        404: task not found
    """
    task = get_db().execute(
        'SELECT * FROM task WHERE id = ?', (id,)
    ).fetchone()
    if task is None or task['author_id'] != g.user['id']:
        return 'Task not found.', 404
    data = request.get_json()
    if not data.get('text'):
        return 'Text is required.', 400
    db = get_db()
    db.execute(
        'INSERT INTO comment (text, task_id, author_id)'
        ' VALUES (?, ?, ?)',
        (data.get('text'), id, g.user['id'])
    )
    db.commit()
    return 'Comment added successfully.', 201

@bp.route('/<int:id>/comments', methods=['GET'])
@login_required
def get_comments(id):
    """ Get all comments for a task by ID.

    Returns:
        200: list of comments
        404: task not found
    """
    task = get_db().execute(
        'SELECT * FROM task WHERE id = ?', (id,)
    ).fetchone()
    if task is None or task['author_id'] != g.user['id']:
        return 'Task not found.', 404
    comments = get_db().execute(
        'SELECT * FROM comment WHERE task_id = ?', (id,)
    ).fetchall()
    comments = [dict(comment) for comment in comments]
    return jsonify(comments), 200

@bp.route('/comments/<int:comment_id>/replies', methods=['GET'])
@login_required
def get_replies(comment_id):
    """ Get all replies for a comment by ID.

    Returns:
        200: list of replies
        404: comment not found
    """
    comment = get_db().execute(
        'SELECT * FROM comment WHERE id = ?', (comment_id,)
    ).fetchone()
    if comment is None:
        return 'Comment not found.', 404
    replies = get_db().execute(
        'SELECT * FROM reply WHERE comment_id = ?', (comment_id,)
    ).fetchall()
    replies = [dict(reply) for reply in replies]
    return jsonify(replies), 200


@bp.route('/comments/<int:comment_id>/replies', methods=['POST'])
@login_required
def add_reply(comment_id):
    """ Add a reply to a comment by ID.

    Returns:
        201: reply added successfully
        400: invalid request
        404: comment not found
    """
    comment = get_db().execute(
        'SELECT * FROM comment WHERE id = ?', (comment_id,)
    ).fetchone()
    if comment is None:
        return 'Comment not found.', 404
    data = request.get_json()
    if not data.get('text'):
        return 'Text is required.', 400
    db = get_db()
    db.execute(
        'INSERT INTO reply (text, comment_id, author_id)'
        ' VALUES (?, ?, ?)',
        (data.get('text'), comment_id, g.user['id'])
    )
    db.commit()
    return 'Reply added successfully.', 201
