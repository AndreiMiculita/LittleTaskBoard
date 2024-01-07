from flask import Blueprint, jsonify

from .auth import login_required

bp = Blueprint('sidebar', __name__)

@bp.route('/', methods=['GET'])
@login_required
def get_sidebar():
    """
    Get the sidebar data. This is a separate API call because the sidebar is not part of the board. 
    Eventually should depend on some user settings.
    """
    
    sidebar_data = {
        'linksByCategory': [
            {
                'id': 1,
                'title': 'Boards',
                'links': [
                    {
                        'id': 1,
                        'title': 'Board',
                        'url': '/'
                    }
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
                    },
                    {
                        'id': 6,
                        'title': 'Insights',
                        'url': '/insights'
                    }
                ]
            },
        ]
    }

    return jsonify(sidebar_data)
