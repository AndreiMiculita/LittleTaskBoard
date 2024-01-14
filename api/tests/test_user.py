def test_get_user_panel(client, auth):
    """
    Given a logged-in user,
    When the '/api/user' endpoint is accessed,
    Then it should return a response with status code 200,
    And the response should have the correct structure and data types.
    """
    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/user', headers={'Authorization': f'Bearer {token}'}, follow_redirects=True)

    assert response.status_code == 200
    assert isinstance(response.get_json(), dict)
    assert isinstance(response.get_json()['links'], list)
    assert isinstance(response.get_json()['links'][0], dict)
    assert isinstance(response.get_json()['links'][0]['id'], int)
    assert isinstance(response.get_json()['links'][0]['title'], str)
    assert isinstance(response.get_json()['links'][0]['url'], str)