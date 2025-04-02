import { useState } from "react";
import { StudentProfile } from "./components/Students/StudentProfile";
import "./App.css";
import { HeroPage } from "./HeroPage";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <HeroPage />
      <Outlet />
    </>
  );
}

export default App;
