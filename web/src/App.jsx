import { useState } from "react";
import { StudentProfile } from "./components/Students/StudentProfile";
import "./App.css";
import { HeroPage } from "./HeroPage";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div>Student Monitoring App</div>
      <HeroPage />
      <Outlet />
    </>
  );
}

export default App;
