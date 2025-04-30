import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SignOutButton, useAuth } from "@clerk/clerk-react"; // Clerk for authentication

import {
  faEnvelope,
  faCalendar,
  faUserGraduate,
  faSignOutAlt, // FontAwesome icon for Sign Out
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

export function ParentDashboardSideBar({ activeSection, setActiveSection }) {
  //fetch student's scores
  async function getScores() {
    const response = await fetch("http://localhost:3000/scores");
    const data = await response.json();
    return data;
  }
  return (
    <div className="w-[300px] h-full bg-gray-100 flex flex-col justify-start rounded-tl-lg rounded-bl-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-purple-500 mb-5">Menu</h2>

      <ul className="list-none p-0 space-y-2">
        {/* Student Profile Section */}
        <li
          onClick={() => setActiveSection("students")}
          className={`flex items-center px-4 py-3 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "students"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faUserGraduate} className="mr-3" />
          <span>Student Profile</span>
        </li>

        {/* Events Section */}
        <li
          onClick={() => setActiveSection("events")}
          className={`flex items-center px-4 py-3 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "events"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faCalendar} className="mr-3" />
          <span>Events</span>
        </li>

        {/* Homework Section */}
        <li
          onClick={() => setActiveSection("homework")}
          className={`flex items-center px-4 py-3 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "homework"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
          <span>Homework</span>
        </li>

        {/* score Section */}
        <li
          onClick={() => setActiveSection("scores")}
          className={`flex items-center px-4 py-3 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "scores"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
          <span>Scores</span>
        </li>

        {/* Messages Section */}
        <li
          onClick={() => setActiveSection("messages")}
          className={`flex items-center px-4 py-3 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "messages"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
          <span>Messages</span>
        </li>

        {/* Sign Out Section */}
        <li>
          <SignOutButton>
            <div className="flex items-center px-4 py-3 cursor-pointer text-base rounded-md transition-all text-gray-800 hover:bg-purple-500 hover:text-white">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
              <span>Sign Out</span>
            </div>
          </SignOutButton>
        </li>
      </ul>
    </div>
  );
}
