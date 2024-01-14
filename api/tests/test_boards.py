

def test_get_board(client, auth):
    (token,) = auth.login().get_json().values()
    response = client.get(
        '/api/boards', headers={'Authorization': f'Bearer {token}'}, follow_redirects=True)
    assert response.status_code == 200

    board = response.get_json()

    assert len(board['columns']) == 3

    assert board['columns'][0]['id'] == 1
    assert board['columns'][0]['title'] == 'To do'
    assert len(board['columns'][0]['tasks']) == 4
    assert board['columns'][0]['tasks'][0]['id'] == 1
    assert board['columns'][0]['tasks'][0]['title'] == 'Feed the cat, dog, and fish'

    assert board['columns'][1]['id'] == 2
    assert board['columns'][1]['title'] == 'In progress'
    assert len(board['columns'][1]['tasks']) == 4
    assert board['columns'][1]['tasks'][0]['id'] == 5
    assert board['columns'][1]['tasks'][0]['title'] == 'Write a book'

    assert board['columns'][2]['id'] == 3
    assert board['columns'][2]['title'] == 'Done'
    assert len(board['columns'][2]['tasks']) == 4
    assert board['columns'][2]['tasks'][0]['id'] == 9
    assert board['columns'][2]['tasks'][0]['title'] == 'Visit the dentist'
