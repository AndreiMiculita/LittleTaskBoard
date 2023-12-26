from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort

from .auth import login_required
from .db import get_db

bp = Blueprint('boards', __name__)


@bp.route('/boards', methods=['GET'])
def index():
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()
    
    # For now we just return a json object
    exampleBoardResponse = {
        'columns': [
            {
                'id': 1,
                'title': 'To do',
                'tasks': [
                    {
                        'id': 1,
                        'title': 'Feed the cat, dog, and fish',
                        'priority': 1,
                        'focus': True,
                        'plannedAt': '2021-01-01T12:00:00Z',
                        'duration': 30

                    },
                    {
                        'id': 2,
                        'title': 'Clean the house; vacuum, dust, mop',
                        'priority': 2,
                        'plannedAt': '2021-01-01T13:00:00Z',
                        'duration': 120
                    },
                    {
                        'id': 3,
                        'title': 'Water the plants and flowers',
                        'priority': 3,
                        'plannedAt': '2021-01-01T15:00:00Z',
                        'duration': 30
                    },
                    {
                        'id': 4,
                        'title': 'Buy tea, coffee, and milk',
                        'priority': 4
                    }
                ]
            },
            {
                'id': 2,
                'title': 'In progress',
                'tasks': [
                    {
                        'id': 5,
                        'title': 'Write a book',
                        'priority': 1
                    },
                    {
                        'id': 6,
                        'title': 'Quit smoking',
                        'priority': 2
                    },
                    {
                        'id': 7,
                        'title': 'Update resume',
                        'priority': 3
                    },
                    {
                        'id': 8,
                        'title': 'Organize the shed',
                        'priority': 4
                    }
                ]
            },
            {
                'id': 3,
                'title': 'Done',
                'tasks': [
                    {
                        'id': 9,
                        'title': 'Visit the dentist',
                        'priority': 1
                    },
                    {
                        'id': 10,
                        'title': 'Install new light bulbs',
                        'priority': 2
                    },
                    {
                        'id': 11,
                        'title': 'Call electrician',
                        'priority': 3
                    },
                    {
                        'id': 12,
                        'title': '3D print a new phone case',
                        'priority': 4
                    }
                ]
            }
        ]
    };

    return jsonify(exampleBoardResponse)


def get_post(id, check_author=True):
    post = get_db().execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()

    if post is None:
        abort(404, f"Post id {id} doesn't exist.")

    if check_author and post['author_id'] != g.user['id']:
        abort(403)

    return post


@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)

    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE post SET title = ?, body = ?'
                ' WHERE id = ?',
                (title, body, id)
            )
            db.commit()
            return redirect(url_for('blog.index'))

    return render_template('blog/update.html', post=post)


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute('DELETE FROM post WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('blog.index'))

