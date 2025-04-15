import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCalendar,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export function SideBar({ activeSection, setActiveSection }) {
  return (
    <div className="w-[300px] h-full bg-gray-100 flex flex-col justify-start rounded-tl-lg rounded-bl-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-purple-500 mb-5">Menu</h2>

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
          onClick={() => setActiveSection("students")}
          className={`flex items-center px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "students"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faUserGraduate} className="mr-3" />
          <span>Students</span>
        </li>
        <li
          onClick={() => setActiveSection("events")}
          className={`flex items-center px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "events"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faCalendar} className="mr-3" />
          <span>Events</span>
        </li>
        <li
          onClick={() => setActiveSection("messages")}
          className={`flex items-center px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "messages"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
          <span>Messages</span>
        </li>
      </ul>
    </div>
  );
}
