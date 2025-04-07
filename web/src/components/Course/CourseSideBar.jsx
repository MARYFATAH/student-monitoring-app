import React from "react";

export function CourseSideBar({ setActiveSection }) {
  return (
    <div className="w-[300px] h-full bg-gray-100 flex flex-col rounded-tl-lg rounded-bl-lg p-4 shadow-md">
      <h2 className=" w-full text-xl font-bold text-purple-500 mb-5">
        Course Menu
      </h2>

      <ul className="list-none p-0">
        <li
          onClick={() => setActiveSection("courses")}
          className="px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all text-gray-800 hover:bg-purple-500 hover:text-white"
        >
          📚 Courses
        </li>

        <li
          onClick={() => setActiveSection("tests")}
          className="px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all text-gray-800 hover:bg-purple-500 hover:text-white"
        >
          📚 Test Management
        </li>
        <li
          onClick={() => setActiveSection("scores")}
          className="px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all text-gray-800 hover:bg-purple-500 hover:text-white"
        >
          👩‍🎓 Score Assignment
        </li>
        <li
          onClick={() => setActiveSection("homework")}
          className="px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all text-gray-800 hover:bg-purple-500 hover:text-white"
        >
          📅 Homework Management
        </li>
      </ul>
    </div>
  );
}
