SET search_path TO studentapp;
SELECT scores.*, assignments.name AS assignment_name, courses.name AS course_name FROM scores
LEFT JOIN assignments ON scores.assignment_id = assignments.assignment_id
LEFT JOIN courses ON assignments.course_id = courses.course_id;
