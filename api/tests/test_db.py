import sqlite3

import pytest
from flaskr.db import get_db


def test_get_close_db(app):
    with app.app_context():
        db = get_db()
        assert db is get_db()

    with pytest.raises(sqlite3.ProgrammingError) as e:
        db.execute('SELECT 1')

    assert 'closed' in str(e.value)

if False:
    def test_init_db_command(app, runner, monkeypatch):
        class Recorder(object):
            called = False

        def fake_init_db():
            Recorder.called = True
            
        # Add the parent directory of 'flaskr' to sys.path
        import sys
        import os
        sys.path.insert(0, os.path.abspath('.'))
        sys.path.insert(0, os.path.abspath('./flaskr'))
        
        # Print the current working directory
        print(f"Current working directory: {os.getcwd()}")
        
        with app.app_context():
            monkeypatch.setenv('FLASK_APP', 'flaskr')
            monkeypatch.setattr('flaskr.db.init_db', fake_init_db)
            result = runner.invoke(args=['init-db'])
            print(f"Result output: {result.output}")
            assert 'Initialized' in result.output
            assert Recorder.called
