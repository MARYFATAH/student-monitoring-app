CREATE SCHEMA IF NOT EXISTS studentapp;

DROP TABLE IF EXISTS studentapp.users;

DROP TYPE IF EXISTS studentapp.role;

CREATE TYPE IF NOT EXISTS studentapp.role AS ENUM ('user',' admin', 'student', 'teacher', 'parent');

CREATE TABLE studentapp.users
(
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    role studentapp.role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS studentapp.parents2students;
CREATE TABLE studentapp.parents2students
(
    parent_id VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES studentapp.users(user_id),
    FOREIGN KEY (student_id) REFERENCES studentapp.users(user_id)
);


DROP TABLE IF EXISTS studentapp.courses;

CREATE TABLE studentapp.courses
(
    course_id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES studentapp.users(user_id)
);

DROP TABLE IF EXISTS studentapp.students2courses;
CREATE TABLE studentapp.students2courses
(
    student_id VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES studentapp.users(user_id),
    FOREIGN KEY (course_id) REFERENCES studentapp.courses(course_id)
);

INSERT INTO studentapp.users (user_id, username, role)
VALUES
    ('clerkId1', 'Joe Admin','admin'),
    ('clerkId2', 'Jane Teacher','teacher'),
    ('clerkId3', 'Alice Teacher','clerk'),
    ('clerkId4', 'Bob Brown','clerk'),
    ('clerkId5', 'Charlie Davis','clerk'),
    

