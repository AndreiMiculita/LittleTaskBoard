DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS task_type;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE post (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES user (id)
);

CREATE TABLE task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  priority INTEGER CHECK(typeof(priority) = 'integer' OR priority IS NULL),
  task_type INTEGER CHECK(typeof(task_type) = 'integer') NOT NULL DEFAULT 0,
  planned_at INTEGER CHECK(typeof(planned_at) = 'integer' OR planned_at IS NULL),
  duration INTEGER CHECK((typeof(duration) = 'integer' AND duration > 0) OR duration IS NULL),
  status INTEGER NOT NULL CHECK(typeof(status) = 'integer'),
  FOREIGN KEY (author_id) REFERENCES user (id)
  FOREIGN KEY (task_type) REFERENCES task_type (id)
) STRICT;

CREATE TABLE task_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

INSERT INTO task_type (name) VALUES ('Regular'), ('Focus'), ('Meeting');

INSERT INTO task (author_id, title, priority, planned_at, duration, status)
VALUES (1, 'Feed the cat, dog, and fish', 1, strftime('%s', 'now', 'start of day', '+14 hours'), 30, 1);
INSERT INTO task (author_id, title, priority, planned_at, duration, status)
VALUES (1, 'Clean the house; vacuum, dust, mop', 2, strftime('%s', 'now', 'start of day', '+1 day', '+14 hours'), 120, 1);
INSERT INTO task (author_id, title, priority, planned_at, duration, status)
VALUES (1, 'Water the plants and flowers', 3, strftime('%s', 'now', 'start of day', '+2 days', '+14 hours'), 30, 1);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Buy tea, coffee, and milk', 4, 1);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Write a book', 1, 2);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Quit smoking', 2, 2);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Update resume', 3, 2);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Organize the shed', 4, 2);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Visit the dentist', 1, 3);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Install new light bulbs', 2, 3);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, 'Call electrician', 3, 3);
INSERT INTO task (author_id, title, priority, status)
VALUES (1, '3D print a new phone case', 4, 3);
INSERT INTO task (author_id, title, priority, status)
VALUES (2, 'Buy a new phone', 1, 4);
