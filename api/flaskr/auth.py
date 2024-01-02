import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash
from itsdangerous import URLSafeTimedSerializer as Serializer, BadTimeSignature, SignatureExpired

from .db import get_db

bp = Blueprint('auth', __name__)

s = Serializer('secret')

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        elif db.execute(
            'SELECT id FROM user WHERE username = ?', (username,)
        ).fetchone() is not None:
            error = f"User {username} is already registered."

        if error is None:
            db.execute(
                'INSERT INTO user (username, password) VALUES (?, ?)',
                (username, generate_password_hash(password))
            )
            db.commit()
            
            token = s.dumps({'id': db.execute('SELECT id FROM user WHERE username = ?', (username,)).fetchone()['id']})
            return jsonify({'token': token}), 201

        return error, 400
    
    return 'Method not allowed.', 405


@bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        user = get_db().execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None or not check_password_hash(user['password'], password):
            return 'Incorrect username or password.', 401

        token = s.dumps({'id': user['id']})
        return jsonify({'token': token})
    
    return 'Method not allowed.', 405


@bp.before_app_request
def load_logged_in_user():
    token = request.headers.get('Authorization')
    if token is None:
        g.user = None
    else:
        try:
            data = s.loads(token)
        except (SignatureExpired, BadTimeSignature):
            g.user = None
        else:
            g.user = get_db().execute(
                'SELECT * FROM user WHERE id = ?', (data['id'],)
            ).fetchone()


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        token = request.headers.get('Authorization')
        if token is None:
            return 'Unauthorized, no token', 401

        token = token.split(' ')[1]

        try:
            data = s.loads(token)
        except (SignatureExpired, BadTimeSignature):
            return 'Unauthorized, bad token', 401

        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (data['id'],)
        ).fetchone()

        if g.user is None:
            return 'Unauthorized, user not found', 401

        return view(**kwargs)

    return wrapped_view
