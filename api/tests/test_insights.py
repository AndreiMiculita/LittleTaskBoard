def test_get_task_status_stats(client, auth):
    """
    Given a logged-in user,
    When the '/api/status' endpoint is accessed,
    Then it should return a response with status code 200,
    And the response should have the correct structure and data types.
    """
    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/insights/status', headers={'Authorization': f'Bearer {token}'}, follow_redirects=True)

    assert response.status_code == 200
    assert isinstance(response.get_json(), dict)
    assert isinstance(response.get_json()['statuses'], list)
    assert isinstance(response.get_json()['statuses'][0], dict)
    assert isinstance(response.get_json()['statuses'][0]['id'], int)
    assert isinstance(response.get_json()['statuses'][0]['title'], str)
    assert isinstance(response.get_json()['statuses'][0]['count'], int)


def test_get_focused_tasks(client, auth):
    """
    Given a logged-in user,
    When the '/api/insights/focus' endpoint is accessed,
    Then it should return a response with status code 200,
    And the response should have the correct structure and data types.
    """
    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/insights/focus', headers={'Authorization': f'Bearer {token}'}, follow_redirects=True)

    assert response.status_code == 200
    assert isinstance(response.get_json(), dict)
    assert 'focus' in response.get_json()
    assert 'total' in response.get_json()
    assert isinstance(response.get_json()['focus'], int)
    assert isinstance(response.get_json()['total'], int)
