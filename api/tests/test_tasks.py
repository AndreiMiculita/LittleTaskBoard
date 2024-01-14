from pkg_resources import to_filename
import pytest
from datetime import datetime
from flask import jsonify
from werkzeug.exceptions import NotFound
from ..flaskr.tasks import validate_and_convert, ValidationError
from ..flaskr.db import get_db


@pytest.mark.parametrize("data, expected_result", [
    ({'key': '10'}, 10),
    ({'key': ''}, None),
    ({}, None),
    ({'key': 'abc'}, ValidationError("Key must be a valid integer.", 400)),
    ({'key': '3'}, ValidationError("Key must be greater than or equal to 5.", 400)),
    ({'key': '20'}, ValidationError("Key must be less than or equal to 15.", 400)),
])
def test_validate_and_convert(data, expected_result):
    try:
        result = validate_and_convert(data, 'key', min_val=5, max_val=15)
        assert result == expected_result
    except ValidationError as e:
        assert str(e) == str(expected_result)


def test_get_tasks(client, auth, app):
    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/tasks/', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert len(response.get_json()) == 10  # Number of tasks in data.sql


@pytest.mark.parametrize("data, expected_result, expected_status", [
    ({
        'title': 'Task 1',
        'priority': 2,
        'type': 1,
        'plannedAt': '2022-01-01T10:00',
        'duration': 3600
    }, 'Task created successfully.', 201),
    ({
        'title': '',
        'priority': 5,
        'type': 3,
        'plannedAt': '2022-01-01T10:00',
        'duration': 3600
    }, 'Title is required.', 400),
    ({
        'title': 'Task 2',
        'priority': 1,
        'type': 0,
        'plannedAt': '2022-01-01T10:00',
        'duration': -1
    }, 'Duration must be greater than or equal to 0.', 400),
    # Add more test cases here
])
def test_post_task(client, auth, app, data, expected_result, expected_status):
    (token,) = auth.login().get_json().values()
    response = client.post('/api/tasks',
                           headers={'Authorization': f'Bearer {token}'},
                           json=data, follow_redirects=True)

    assert response.status_code == expected_status
    assert response.data.decode('utf-8') == expected_result


def test_get_task(client, auth, app):
    (token,) = auth.login().get_json().values()
    response = client.get('/api/tasks/1', headers={
        'Authorization': f'Bearer {token}'}, follow_redirects=True)
    assert response.status_code == 200
    task = response.get_json()
    assert task['author_id'] == 1
    assert task['title'] == 'Feed the cat, dog, and fish'
    assert task['priority'] == 1
    assert task['duration'] == 30
    assert task['status'] == 1


@pytest.mark.parametrize("search_query, sort_by, sort_direction, expected_length, expected_first_title", [
    ("smoking", None, None, 1, "Quit smoking"),
    ("the", "priority", "asc", 5, "Feed the cat, dog, and fish"),
    ("the", "priority", "desc", 5, "Organize the shed")
])
def test_search_tasks(client, auth, app, search_query, sort_by, sort_direction, expected_length, expected_first_title):
    (token,) = auth.login().get_json().values()
    # Search for tasks
    response = client.get(f'/api/tasks?q={search_query}&sort_by={sort_by}&sort_direction={sort_direction}',
                          headers={'Authorization': f'Bearer {token}'}, follow_redirects=True)
    assert response.status_code == 200
    tasks = response.get_json()
    assert len(tasks) == expected_length
    assert tasks[0]['title'] == expected_first_title


def test_update_task(client, auth, app):
    (token,) = auth.login().get_json().values()
    # Update task
    response = client.patch('/api/tasks/1',
                            headers={'Authorization': f'Bearer {token}'},
                            json={
                                'title': 'Updated Task',
                                'priority': 3,
                                'type': 2,
                                'planned_at': '2022-01-01T12:00',
                                'duration': 60
                            })
    assert response.status_code == 200
    assert response.data.decode('utf-8') == 'Task updated successfully.'

    response = client.get('/api/tasks/1',
                          headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

    task = response.get_json()
    assert task['title'] == 'Updated Task'
    assert task['priority'] == 3
    assert task['task_type'] == 2
    assert task['planned_at'] == '2022-01-01T12:00:00'
    assert task['duration'] == 60


def test_delete_task(client, auth, app):
    # Delete task
    response = client.delete('/api/tasks/1', headers={
        'Authorization': f'Bearer {auth.login().get_json()["token"]}'})
    assert response.status_code == 200
    assert response.data.decode('utf-8') == 'Task deleted successfully.'

    response = client.get('/api/tasks/1', headers={
        'Authorization': f'Bearer {auth.login().get_json()["token"]}'})
    assert response.status_code == 404
    assert response.data.decode('utf-8') == 'Task not found.'
