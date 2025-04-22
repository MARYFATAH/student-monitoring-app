import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faClipboard,
  faChartBar,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

export function CourseSideBar({ activeSection, setActiveSection }) {
  return (
    <div className="w-[300px] h-full bg-gray-100 flex flex-col rounded-tl-lg rounded-bl-lg p-4 shadow-md">
      <h2 className="w-full text-xl font-bold text-purple-500 mb-5">
        Course Menu
      </h2>

      <ul className="list-none p-0">
        <li
          onClick={() => setActiveSection("courses")}
          className={`flex items-center px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "courses"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
          <span>Courses</span>
        </li>

        <li
          onClick={() => setActiveSection("tests")}
          className={`flex items-center px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "tests"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faClipboard} className="mr-3" />
          <span>Test Management</span>
        </li>

        <li
          onClick={() => setActiveSection("scores")}
          className={`flex items-center px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "scores"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faChartBar} className="mr-3" />
          <span>Score Assignment</span>
        </li>

        <li
          onClick={() => setActiveSection("homework")}
          className={`flex items-center px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "homework"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
          <span>Homework Management</span>
        </li>
      </ul>
    </div>
  );
}
