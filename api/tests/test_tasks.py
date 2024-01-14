import pytest
from ..flaskr.tasks import validate_and_convert, parse_date_to_timestamp, ValidationError


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


@pytest.mark.parametrize("date_str, expected_result", [
    ('2022-01-01T10:00', 1641027600),
    ('2022-12-31T23:59', 1672527540),
    ('2023-06-15T12:30', 1686825000),
    ('', None),
    (None, None),
    ('2022-01-01', ValidationError('Invalid date format. Use YYYY-MM-DDTHH:MM.', 400)),
    ('2022-01-01T10:00:00',
     ValidationError('Invalid date format. Use YYYY-MM-DDTHH:MM.', 400)),
    ('abc', ValidationError('Invalid date format. Use YYYY-MM-DDTHH:MM.', 400)),
])
def test_parse_date_to_timestamp(date_str, expected_result):
    try:
        result = parse_date_to_timestamp(date_str)
        assert result == expected_result
    except ValidationError as e:
        assert str(e) == str(expected_result)


def test_login_required(client, auth, app):
    response = client.get('/api/tasks', follow_redirects=True)
    assert response.status_code == 401
    assert response.data.decode('utf-8') == 'Unauthorized, no token'

    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/tasks', headers={'Authorization': f'Bearer {token}'}, follow_redirects=True)
    assert response.status_code == 200


def test_get_tasks(client, auth, app):
    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/tasks/', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert len(response.get_json()) == 10  # Pagination is set to 10 by default


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


@pytest.mark.parametrize("task_id, expected_status, expected_data", [
    (1, 200, {
        'author_id': 1,
        'id': 1,
        'title': 'Feed the cat, dog, and fish',
        'priority': 1,
        'duration': 30,
        'task_type': 0,
        'status': 1
    }),
    (13, 404, 'Task not found.'),  # Task with id 13 belongs to another user
    (100, 404, 'Task not found.')  # Task with id 100 does not exist
])
def test_get_task(client, auth, app, task_id, expected_status, expected_data):
    (token,) = auth.login().get_json().values()
    response = client.get(f'/api/tasks/{task_id}', headers={
        'Authorization': f'Bearer {token}'}, follow_redirects=True)
    assert response.status_code == expected_status
    if isinstance(expected_data, dict):
        task_data = response.get_json()
        for key in expected_data:
            if key != 'planned_at':
                assert task_data[key] == expected_data[key]
    else:
        assert response.data.decode('utf-8') == expected_data


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


@pytest.mark.parametrize("task_id, expected_status, expected_data", [
    (1, 200, 'Task deleted successfully.'),
    (13, 404, 'Task not found.'),  # Task with id 13 belongs to another user
    (100, 404, 'Task not found.')  # Task with id 100 does not exist
])
def test_delete_task(client, auth, app, task_id, expected_status, expected_data):
    (token,) = auth.login().get_json().values()
    response = client.delete(
        f'/api/tasks/{task_id}', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == expected_status
    assert response.data.decode('utf-8') == expected_data

    # Check that the task was deleted
    response = client.get(
        f'/api/tasks/{task_id}', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 404
    assert response.data.decode('utf-8') == 'Task not found.'
