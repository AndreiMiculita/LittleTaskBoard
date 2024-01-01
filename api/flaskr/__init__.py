import os

from flask import Flask
from flask_cors import CORS


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    import time
    # a simple page that returns current time
    @app.route('/time')
    def current_time():
        return {'time': time.time()}

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp, url_prefix='/api/auth')

    # from . import blog
    # app.register_blueprint(blog.bp)
    # app.add_url_rule('/', endpoint='index')

    from . import sidebar
    app.register_blueprint(sidebar.bp, url_prefix='/api/sidebar')

    from . import boards
    app.register_blueprint(boards.bp, url_prefix='/api/boards')

    from . import tasks
    app.register_blueprint(tasks.bp, url_prefix='/api/tasks')

    from . import user
    app.register_blueprint(user.bp, url_prefix='/api/user')
    
    from . import insights
    app.register_blueprint(insights.bp, url_prefix='/api/insights')

    return app
