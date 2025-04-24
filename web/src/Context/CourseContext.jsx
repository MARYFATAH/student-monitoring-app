import React, { createContext, useContext, useState } from "react";

const CourseContext = createContext(); // Create and export the context

export const useCourseContext = () => {
  return useContext(CourseContext); // Custom hook for accessing the context
};

export const CourseProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("courses");
  const [isEditing, setIsEditing] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    name: "",
    description: "",
    schedule: {
      weeklyday: "",
      weeklytime: "",
    },
  });
  const [tests, setTests] = useState([]);
  const [homework, setHomework] = useState([]);
  const [addedStudents, setAddedStudents] = useState([]);
  const [studentScores, setStudentScores] = useState({});
  const [newTestName, setNewTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testScore, setTestScore] = useState(0);
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState({
    weeklyday: "",
    weeklytime: "",
  });
  const [courseStudents, setCourseStudents] = useState([]);
  const [newHomeworkName, setNewHomeworkName] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Added for selected student ID
  const [selectAll, setSelectAll] = useState(false); // Added for select all functionality
  const [students, setStudents] = useState([]); // Added for students list

  // Consolidate context values
  const contextValue = {
    activeSection,
    setActiveSection,
    isEditing,
    setIsEditing,
    courseDetails,
    setCourseDetails,
    tests,
    setTests,
    homework,
    setHomework,
    addedStudents,
    setAddedStudents,
    studentScores,
    setStudentScores,
    newTestName,
    setNewTestName,
    testDate,
    setTestDate,
    testScore, // Added to make test score accessible
    setTestScore, // Added for test score updates
    newCourseName,
    setNewCourseName,
    selectedSchedule,
    setSelectedSchedule,
    selectedDescription,
    setSelectedDescription,
    courseStudents,
    setCourseStudents,
    newHomeworkName,
    setNewHomeworkName, // Added for new homework updates
    selectedStudentId, // Added for selected student ID
    setSelectedStudentId, // Added for selected student ID updates
    selectAll, // Added for select all functionality
    setSelectAll, // Added for select all functionality updates
    students, // Added for students list
    setStudents, // Added for students list updates
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};
