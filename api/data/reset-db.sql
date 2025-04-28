CREATE SCHEMA IF NOT EXISTS studentapp;

DROP TYPE IF EXISTS studentapp.role CASCADE;

CREATE TYPE studentapp.role AS ENUM ('user','admin', 'student', 'teacher', 'parent');

DROP TABLE IF EXISTS studentapp.users CASCADE;

CREATE TABLE studentapp.users
(
    user_id VARCHAR(255) PRIMARY KEY,
    phone_number VARCHAR(255),
    address VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    dob DATE,
    email VARCHAR(255),
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
    description TEXT,
    weeklyday VARCHAR(255),
    weeklytime VARCHAR(255),
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

-- CREATE, UPDATE, DELETE, GET per course and per student
-- /assignmets

-- assignments
-- type "homework", "test"
DROP TABLE IF EXISTS studentapp.assignments CASCADE;
CREATE TABLE studentapp.assignments(
    assignment_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    assignment_type VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES studentapp.courses(course_id) ON DELETE CASCADE
);

-- CREATE, UPDATE, DELETE, GET per assignment, per student
-- /scores

-- scores
-- score -1 means absent
DROP TABLE IF EXISTS studentapp.scores CASCADE;
CREATE TABLE studentapp.scores(
    student_id VARCHAR(255) NOT NULL,
    assignment_id INT NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES studentapp.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES studentapp.assignments(assignment_id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, assignment_id)
);

-- CREATE, UPDATE, DELETE, GET all
-- /events

-- events
DROP TABLE IF EXISTS studentapp.events CASCADE;
CREATE TABLE studentapp.events(
    event_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    related_assignment_id INT,
    name VARCHAR(255),
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES studentapp.courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (related_assignment_id) REFERENCES studentapp.assignments(assignment_id) ON DELETE CASCADE
);

INSERT INTO studentapp.users (user_id, first_name, last_name, role)
VALUES
    ('clerkId1', 'Joe','Admin','admin'),
    ('clerkId2', 'Jane', 'Teacher','teacher'),
    ('clerkId3', 'Bob', 'Teacher','teacher'),
    ('clerkId4', 'Alice', 'Student','student'),
    ('clerkId5', 'John', 'Student','student'),
    ('clerkId6', 'Charlie', 'Student','student'),
    ('clerkId7', 'Emily', 'Student','student'),
    ('clerkId8', 'Michael', 'Student','student'),
    ('clerkId9', 'Olivia', 'Student','student'),
    ('clerkId10', 'Sophia', 'Student','student'),
    ('clerkId11', 'Liam', 'Student','student'),
    ('clerkId12', 'Noah', 'Student','student'),
    ('clerkId13', 'Ava', 'Student','student'),
    ('clerkId14', 'Isabella', 'Student','student'),
    ('clerkId15', 'Mason', 'Student','student'),
    ('clerkId16', 'Lucas', 'Student','student'),
    ('clerkId17', 'Amelia', 'Student','student'),
    ('clerkId18', 'Harper', 'Student','student'),
    ('clerkId19', 'Evelyn', 'Student','student'),
    ('user_2vOdwaPvnq4CRVTX4fBaRcpZRjG', 'Maryam', 'Teacher', 'teacher' ),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 'Maryam Fattah', 'Student', 'student' ),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'John', 'Teacher', 'teacher'),
    ('user_2vOyBjnxrbBBEjNb3VkO8FdzZzB', 'Ralf', 'Teacher', 'teacher'),
    ('user_2vlZdvA4w0gbX9w4oFdRkTaGghC', 'Sascha', 'Teacher', 'teacher');

INSERT INTO studentapp.courses (teacher_id, name)
VALUES
    ('clerkId2', 'Math 101'),
    ('clerkId2', 'History 101'),
    ('clerkId3', 'Science 101'),
    ('clerkId3', 'English 101'),
    ('clerkId3', 'Art 101'),
    ('user_2vOdwaPvnq4CRVTX4fBaRcpZRjG', 'Math 101'),
    ('user_2vOdwaPvnq4CRVTX4fBaRcpZRjG', 'History 101'),
    ('user_2vOdwaPvnq4CRVTX4fBaRcpZRjG', 'Science 101'),
    ('user_2vOdwaPvnq4CRVTX4fBaRcpZRjG', 'English 101'),
    ('user_2vOdwaPvnq4CRVTX4fBaRcpZRjG', 'Art 101'),
    ('user_2vOyBjnxrbBBEjNb3VkO8FdzZzB', 'Math 102'),
    ('user_2vOyBjnxrbBBEjNb3VkO8FdzZzB', 'History 102'),
    ('user_2vlZdvA4w0gbX9w4oFdRkTaGghC', 'Science 102'),
    ('user_2vlZdvA4w0gbX9w4oFdRkTaGghC', 'English 102'),   
    ('user_2vlZdvA4w0gbX9w4oFdRkTaGghC', 'English 102'),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'Math 102'),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'History 102'),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'Science 102'),
    ('user_2vOyBjnxrbBBEjNb3VkO8FdzZzB', 'Art 102');

INSERT INTO studentapp.students2courses (student_id, course_id)
VALUES
    ('clerkId4', 1),
    ('clerkId5', 1),
    ('clerkId6', 1),
    ('clerkId4', 2),
    ('clerkId5', 2),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 1),
    ('user_2vlZdvA4w0gbX9w4oFdRkTaGghC', 2),
    ('user_2vlZdvA4w0gbX9w4oFdRkTaGghC', 3),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 4),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 5);

INSERT INTO studentapp.assignments (course_id, assignment_type, name, description, due_date)
VALUES
    (1, 'homework', 'Math Homework 1', 'Solve the problems in chapter 1', '2025-05-01'),
    (1, 'test', 'Math Test 1', 'Test on chapter 1', '2025-05-15'),
    (2, 'homework', 'History Homework 1', 'Read chapter 2 and answer questions', '2025-05-05'),
    (2, 'test', 'History Test 1', 'Test on chapter 2', '2025-05-20'),
    (3, 'homework', 'Science Homework 1', 'Complete the lab report', '2025-05-10'),
    (3, 'test', 'Science Test 1', 'Test on chapter 3', '2025-05-25'),
    (7,'homework', 'History Homework 15', 'Complete the lab report', '2025-05-10'),
    (6,'homework', 'History homework 15', 'Test on chapter 3', '2025-05-25'),
    (6,'homework', 'History homework 15', 'Test on chapter 3', '2025-05-25');

INSERT INTO studentapp.scores (student_id, assignment_id, score)
VALUES
    ('clerkId4', 1, 1),
    ('clerkId5', 1, 3),
    ('clerkId6', 1, 2),
    ('clerkId4', 2, 5),
    ('clerkId5', 2, -1);

INSERT INTO studentapp.events (course_id, related_assignment_id, name, description, event_date, start_time, end_time)
VALUES
    (1, 2, 'Math Test 1', 'Test on chapter 1', '2025-05-15', NULL, NULL),
    (2, 4, 'History Test', 'Test on chapter 2', '2025-05-20', NULL, NULL),
    (3, NULL, 'Party', 'Free cocktails!', '2025-05-12', '20:00:00', '23:00:00');