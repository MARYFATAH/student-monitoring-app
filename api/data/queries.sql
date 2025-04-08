SELECT * FROM studentapp.students2courses 
LEFT JOIN studentapp.users ON studentapp.users.user_id=studentapp.students2courses.student_id
WHERE studentapp.students2courses.course_id=1;