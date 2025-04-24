import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CourseSideBar } from "./CourseSideBar";
import { useAuth } from "@clerk/clerk-react";
import { CourseProvider } from "../../Context/CourseContext";
import { CourseSection } from "./CourseDetails/CourseSection";
import { TestSection } from "./CourseDetails/TestSection";
import { HomeworkSection } from "./CourseDetails/HomeworkSection";
import { ScoreSection } from "./CourseDetails/ScoreSection";

export function CourseDetails() {
  const { courseId } = useParams(); // Get courseId from the URL
  const [activeSection, setActiveSection] = useState("courses");
  const [courseDetails, setCourseDetails] = useState(null); // Course details
  const [courseStudents, setCourseStudents] = useState([]); // List of students
  const [addedStudents, setAddedStudents] = useState([]); // List of added students
  const [courses, setCourses] = useState([]); // List of courses
  const [students, setStudents] = useState([]); // List of all students
  const [selectedStudentId, setSelectedStudentId] = useState(""); // Individual student selection
  const [selectAll, setSelectAll] = useState(false); // Select all students
  const [tests, setTests] = useState([]); // List of tests
  const [newTestName, setNewTestName] = useState(""); // New test name
  const [studentScores, setStudentScores] = useState({}); // Scores of students for tests
  const [homework, setHomework] = useState([]); // List of homework
  const [newHomeworkName, setNewHomeworkName] = useState(""); // New homework name
  const [newHomeworkDescription, setNewHomeworkDescription] = useState(""); // Homework description
  const [newHomeworkDueDate, setNewHomeworkDueDate] = useState(""); // Homework due date
  const [selectedSchedule, setSelectedSchedule] = useState(""); // Course schedule
  const [selectedDescription, setSelectedDescription] = useState(""); // Course description
  const [newCourseName, setNewCourseName] = useState(""); // New course name
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [testDate, setTestDate] = useState(""); // Test date

  const { getToken } = useAuth(); // Authentication token

  // Fetch course details when the component mounts

  //Patch course details logic

  // Fetch students in course logic
  // Fetch students in course when the component mounts

  // Add new student logic

  // edit course logic

  // Add new test logic

  //save course details logic

  // Delete course logic
  // Add new homework logic

  // Update scores logic

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg overflow-hidden">
      <CourseSideBar
        className="bg-blue-600 text-white w-full lg:w-1/4 h-auto lg:h-full py-8 shadow-md"
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      <div className="flex-1 bg-white rounded-lg shadow-lg mx-4 my-6 lg:my-10 p-6 lg:p-10 overflow-y-auto sm:mx-2 lg:mx-4 sm:p-4 lg:p-10 ">
        {/* <h1 className="text-3xl lg:text-4xl font-bold text-purple-700 text-center mb-8">
          Course " {courseDetails.name} " Details
        </h1> */}
        {activeSection === "courses" && (
          <CourseSection
            courseDetails={courseDetails}
            setCourseDetails={setCourseDetails}
            setActiveSection={setActiveSection}
            setCourses={setCourses}
            courses={courses}
          />
        )}

        {activeSection === "scores" && (
          <ScoreSection
            tests={tests}
            addedStudents={addedStudents}
            studentScores={studentScores}
            setStudentScores={setStudentScores}
            students={students}
            setStudents={setStudents}
          />
        )}

        {activeSection === "tests" && (
          <TestSection tests={tests} setTests={setTests} />
        )}
        {activeSection === "homework" && (
          <HomeworkSection homework={homework} setHomework={setHomework} />
        )}
      </div>
    </div>
  );
}
