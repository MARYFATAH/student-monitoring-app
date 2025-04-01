import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { StudentList } from "./components/Students/StudentList.jsx";
import { StudentProfile } from "./components/Students/StudentProfile.jsx";
import { CourseList } from "./components/Course/CourseList.jsx";
import { CourseDetails } from "./components/Course/CourseDetails.jsx";
import { ParentDashboard } from "./components/Dashboard/ParentDashboard.jsx";
import { TeacherDashboard } from "./components/Dashboard/TeacherDashboard.jsx";
import { HeroPage } from "./HeroPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/:studentId" element={<StudentProfile />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/parentdashboard" element={<ParentDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
