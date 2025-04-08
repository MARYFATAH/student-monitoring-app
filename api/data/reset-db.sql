CREATE SCHEMA IF NOT EXISTS studentapp;



DROP TYPE IF EXISTS studentapp.role CASCADE;

CREATE TYPE studentapp.role AS ENUM ('user','admin', 'student', 'teacher', 'parent');

DROP TABLE IF EXISTS studentapp.users CASCADE;

CREATE TABLE studentapp.users
(
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    role studentapp.role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS studentapp.courses CASCADE;
CREATE TABLE studentapp.courses
(
    course_id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES studentapp.users(user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS studentapp.parents2students CASCADE;
CREATE TABLE studentapp.parents2students
(
    parent_id VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES studentapp.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES studentapp.users(user_id) ON DELETE CASCADE
);




DROP TABLE IF EXISTS studentapp.students2courses CASCADE;
CREATE TABLE studentapp.students2courses
(
    student_id VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES studentapp.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES studentapp.courses(course_id) ON DELETE CASCADE
);

INSERT INTO studentapp.users (user_id, username, role)
VALUES
    ('clerkId1', 'Joe Admin','admin'),
    ('clerkId2', 'Jane Teacher','teacher'),
    ('clerkId3', 'Bob Teacher','teacher'),
    ('clerkId4', 'Alice Student','student'),
    ('clerkId5', 'John Student','student'),
    ('clerkId6', 'Charlie Student','student');

INSERT INTO studentapp.courses (teacher_id, name)
VALUES
    ('clerkId2', 'Math 101'),
    ('clerkId2', 'History 101'),
    ('clerkId3', 'Science 101'),
    ('clerkId3', 'English 101'),
    ('clerkId3', 'Art 101');

INSERT INTO studentapp.students2courses (student_id,course_id )
VALUES
    ('clerkId4', 1),
    ('clerkId5', 1),
    ('clerkId6', 1),
    ('clerkId4', 2),
    ('clerkId5', 2);

