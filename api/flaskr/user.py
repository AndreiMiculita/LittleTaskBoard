from flask import Blueprint, jsonify

from .auth import login_required

bp = Blueprint('user', __name__)

@bp.route('/', methods=['GET'])
@login_required
def get_user_panel():
    user_panel_data = {
        'links': [
            {
                'id': 1,
                'title': 'Settings',
                'url': '/settings'
            },
            {
                'id': 2,
                'title': 'Log Out',
                'url': '/logout'
            }
        ]
    }

    return jsonify(user_panel_data)
