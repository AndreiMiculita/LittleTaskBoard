from flask import Blueprint, jsonify

bp = Blueprint('sidebar', __name__)

@bp.route('/sidebar', methods=['GET'])
def get_sidebar():
    sidebar_data = {
        'linksByCategory': [
            {
                'id': 1,
                'title': 'Boards',
                'links': [
                    {
                        'id': 1,
                        'title': 'Board 1',
                        'url': '/board/1'
                    },
                    {
                        'id': 2,
                        'title': 'Board 2',
                        'url': '/board/2'
                    },
                    {
                        'id': 3,
                        'title': 'Board 3',
                        'url': '/board/3'
                    },
                ]
            },
            {
                'id': 2,
                'title': 'Planning',
                'links': [
                    {
                        'id': 4,
                        'title': 'Calendar',
                        'url': '/calendar'
                    },
                    {
                        'id': 5,
                        'title': 'Tasks',
                        'url': '/tasks'
                    }
                ]
            },
        ]
    }

    return jsonify(sidebar_data)
