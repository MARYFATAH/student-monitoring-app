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
    weeklyDays VARCHAR(255),
    weeklyHours VARCHAR(255),
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
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'Ralf', 'Teacher', 'teacher');

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
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'Math 102'),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'History 102'),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'Science 102'),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'English 102'),
    ('user_2vTuPIO9KgsP7fMA5nZ8UHy7erx', 'Art 102');

INSERT INTO studentapp.students2courses (student_id, course_id)
VALUES
    ('clerkId4', 1),
    ('clerkId5', 1),
    ('clerkId6', 1),
    ('clerkId4', 2),
    ('clerkId5', 2),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 1),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 2),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 3),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 4),
    ('user_2vTtGULPmuR6g4tCGOodztViTjk', 5);