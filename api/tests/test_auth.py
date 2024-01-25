import pytest
from flask import g, session
from flaskr.db import get_db


def test_register(client, app):
    response = client.post(
        '/api/auth/register', json={'username': 'a', 'password': 'a'}
    )
    assert response.status_code == 201
    assert 'token' in response.json

    with app.app_context():
        db = get_db()
        user = db.execute(
            "SELECT * FROM user WHERE username = 'a'",
        ).fetchone()
        assert user is not None
        assert user['username'] == 'a'


@pytest.mark.parametrize(('username', 'password', 'expected_status', 'expected_data'), (
    ('test', 'password', 400, b'User test is already registered.'),
    ('', 'password', 400, b'Username is required.'),
    ('test', '', 400, b'Password is required.')
))
def test_register_validate_input(client, username, password, expected_status, expected_data):
    response = client.post(
        '/api/auth/register',
        json={'username': username, 'password': password}
    )
    assert response.status_code == expected_status
    assert response.data == expected_data


def test_login(auth):
    response = auth.login()
    assert response.status_code == 200
    assert 'token' in response.json


@pytest.mark.parametrize(('username', 'password', 'message'), (
    ('a', 'test', b'Incorrect username or password.'),
    ('test', 'a', b'Incorrect username or password.'),
))
def test_login_validate_input(auth, username, password, message):
    response = auth.login(username, password)
    assert message in response.data


def test_logout(client, auth):
    auth.login()

    with client:
        response = auth.logout()
        assert response.status_code == 302
        assert 'user_id' not in session
