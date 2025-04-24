import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { StudentList } from "./components/Students/StudentList.jsx";
import { StudentProfile } from "./components/Students/StudentProfile.jsx";
import { CourseList } from "./components/Course/CourseList.jsx";
import { CourseDetails } from "./components/Course/CourseDetails.jsx";
import { ParentDashboard } from "./components/Dashboard/ParentDashboard.jsx";
import { TeacherDashboard } from "./components/Dashboard/TeacherDashboard.jsx";
import { Login } from "./components/Authentication/Login.jsx";
import { SignUp } from "./components/Authentication/SignUp.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { HeroPage } from "./HeroPage.jsx";
import { ProfileProvider } from "./Context/ProfileProvider.jsx";
import { CourseProvider } from "./Context/CourseContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Publishable Key in .env file");
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ProfileProvider>
        <CourseProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<HeroPage />} />
                <Route path="/students" element={<StudentList />} />
                <Route
                  path="/students/:studentId"
                  element={<StudentProfile />}
                />
                <Route path="/users/:studentId" element={<StudentProfile />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:courseId" element={<CourseDetails />} />
                <Route
                  path="/teacherdashboard"
                  element={<TeacherDashboard />}
                />
                <Route path="/parentdashboard" element={<ParentDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CourseProvider>
      </ProfileProvider>
    </ClerkProvider>
  </StrictMode>
);
