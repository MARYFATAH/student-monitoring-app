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
  const [activeSection, setActiveSection] = useState("courses");
  const [courseDetails, setCourseDetails] = useState(null); // Course details
  const [addedStudents, setAddedStudents] = useState([]); // List of added studentss
  const [courses, setCourses] = useState([]); // List of courses
  const [students, setStudents] = useState([]); // List of all students

  const [tests, setTests] = useState([]); // List of tests
  const [newTestName, setNewTestName] = useState(""); // New test name
  const [studentScores, setStudentScores] = useState({}); // Scores of students for tests
  const [homework, setHomework] = useState([]); // List of homework

  return (
    <div className="h-screen grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2  bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
      {/* Sidebar */}
      <CourseSideBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className=" bg-blue-600 text-white shadow-md h-full rounded-lg lg:col-span-1 sm:w-1/4 @min-[475px]:flex-row md:col-span-1 sm:col-span-1"
      />

      {/* Main Content Area */}
      <div className="lg:col-span-3 md:col-span-3 md:m-30 sm:m-2  bg-white rounded-lg shadow-lg m-4 sm:m-2 lg:m-6 p-6 sm:p-4 lg:p-8 overflow-y-auto">
        {/* Dynamic Section Rendering */}
        {activeSection === "courses" && (
          <CourseSection
            className="lg:mx-4"
            courseDetails={courseDetails}
            setCourseDetails={setCourseDetails}
            setActiveSection={setActiveSection}
            setCourses={setCourses}
            courses={courses}
          />
        )}

        {activeSection === "students" && (
          <StudentList students={students} setStudents={setStudents} />
        )}

        {activeSection === "events" && <EventList events={events} />}

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
