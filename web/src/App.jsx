import { use, useState } from "react";
import { StudentProfile } from "./components/Students/StudentProfile";
import "./App.css";
import { HeroPage } from "./HeroPage";
import { Outlet } from "react-router-dom";
import { students } from "./Data/Course";
import { CourseDetails } from "./components/Course/CourseDEtails";
import { TeacherDashboard } from "./components/Dashboard/TeacherDashboard";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import { CourseList } from "./components/Course/CourseList";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const { getToken } = useAuth(); // Correct token retrieval
  console.log("Courses:", courses);
  console.log("setCourses:", setCourses);

  const handleAddTestToStudent = (studentId, test) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, tests: [...student.tests, test] }
          : student
      )
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true); // Set loading to true when fetching begins
      setError(null); // Reset error state
      try {
        const token = await getToken(); // Retrieve JWT token
        const response = await fetch("http://localhost:3000/courses", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach Bearer token
          },
        });

        // Handle non-OK responses
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON data
        setCourses(data); // Update state with fetched courses
        console.log(data); // Log data for debugging
      } catch (err) {
        console.error("Error fetching courses:", err); // Log error
        setError(err.message); // Update error state
      } finally {
        setLoading(false); // Set loading to false when fetch ends
      }
    };

    fetchCourses();
  }, []);
  useEffect(() => {
    console.log("Courses state updated:", courses); // Debug log
  }, [courses]); // Log whenever courses state changes

  return (
    <>
      <h1>Test</h1>
      {/* <HeroPage />
      <TeacherDashboard courses={courses} setCourses={setCourses} />
      <CourseList courses={courses} />
      <StudentProfile students={students} setStudents={setStudents} />
      <CourseDetails courses={courses} setCourses={setCourses} />
      <Outlet /> */}
    </>
  );
}
