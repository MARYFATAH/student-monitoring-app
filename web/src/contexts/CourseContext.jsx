import React, { createContext, useState } from "react";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Mathematics",
      teacher: "Mr. Smith",
      duration: "3 months",
      description: "Learn algebra, geometry, and more.",
    },
    {
      id: 2,
      name: "Science",
      teacher: "Ms. Johnson",
      duration: "4 months",
      description: "Explore physics, biology, and chemistry.",
    },
    {
      id: 3,
      name: "English",
      teacher: "Mr. Brown",
      duration: "2 months",
      description: "Focus on grammar, vocabulary, and literature.",
    },
    {
      id: 4,
      name: "History",
      teacher: "Ms. Green",
      duration: "3 months",
      description: "Discover world history from ancient to modern times.",
    },
  ]);

  return (
    <CourseContext.Provider value={{ courses, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
};
