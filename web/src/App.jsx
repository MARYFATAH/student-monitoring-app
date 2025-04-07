import { useState } from "react";
import { StudentProfile } from "./components/Students/StudentProfile";
import "./App.css";
import { HeroPage } from "./HeroPage";
import { Outlet } from "react-router-dom";
import { students } from "./Data/Course";
import { CourseDetails } from "./components/Course/CourseDEtails";

function App() {
  const handleAddTestToStudent = (studentId, test) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, tests: [...student.tests, test] }
          : student
      )
    );
  };

  return (
    <>
      <HeroPage />
      <StudentProfile students={students} />
      <CourseDetails
        students={students}
        onAddTestToStudent={handleAddTestToStudent}
      />
      <Outlet />
    </>
  );
}

export default App;
