def test_get_sidebar(client, auth):
    """
    Given a logged-in user,
    When the '/api/sidebar' endpoint is accessed,
    Then it should return a response with status code 200,
    And the response should have the correct structure and data types.
    """
    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/sidebar', headers={'Authorization': f'Bearer {token}'}, follow_redirects=True)

    assert response.status_code == 200
    # We check that the response is similar to the example data (it's not always the same)
    # We just check that the shape is the same (a list of dicts with the same keys)
    assert isinstance(response.get_json(), dict)
    assert isinstance(response.get_json()['linksByCategory'], list)
    assert isinstance(response.get_json()['linksByCategory'][0], dict)
    assert isinstance(response.get_json()['linksByCategory'][0]['id'], int)
    assert isinstance(response.get_json()['linksByCategory'][0]['title'], str)
    assert isinstance(response.get_json()['linksByCategory'][0]['links'], list)
    assert isinstance(response.get_json()[
                      'linksByCategory'][0]['links'][0], dict)
    assert isinstance(response.get_json()[
                      'linksByCategory'][0]['links'][0]['id'], int)
    assert isinstance(response.get_json()[
                      'linksByCategory'][0]['links'][0]['title'], str)
    assert isinstance(response.get_json()[
                      'linksByCategory'][0]['links'][0]['url'], str)
