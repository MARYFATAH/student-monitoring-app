import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";
import App from "./App.jsx";
import { StudentList } from "./components/Students/StudentList.jsx";
import { StudentProfile } from "./components/Students/StudentProfile.jsx";
import { CourseList } from "./components/Course/CourseList.jsx";
import { CourseDetails } from "./components/Course/CourseDetails.jsx";
import { ParentDashboard } from "./components/Dashboard/ParentDashboard.jsx";
import { TeacherDashboard } from "./components/Dashboard/TeacherDashboard.jsx";
import { Login } from "./components/Authentication/Login.jsx";
import { SignUp } from "./components/Authentication/SignUp.jsx";
import { CourseProvider } from "./contexts/CourseContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CourseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/students" element={<StudentList />}>
            <Route path="/students/:studentId" element={<StudentProfile />} />
          </Route>
          <Route path="/courses" element={<CourseList />}>
            <Route path="/courses/:courseId" element={<CourseDetails />} />
          </Route>
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/parentdashboard" element={<ParentDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </CourseProvider>
  </StrictMode>
);
