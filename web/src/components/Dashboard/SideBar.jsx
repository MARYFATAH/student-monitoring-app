import "./SideBar.css";

export function SideBar({ activeSection, setActiveSection }) {
  return (
    <div className="w-[300px] h-full bg-gray-100 flex flex-col rounded-tl-lg rounded-bl-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-purple-500 mb-5">Menu</h2>

      <ul className="list-none p-0">
        <li
          onClick={() => setActiveSection("courses")}
          className={`px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "courses"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          📚 Courses
        </li>
        <li
          onClick={() => setActiveSection("students")}
          className={`px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "students"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          👩‍🎓 Students
        </li>
        <li
          onClick={() => setActiveSection("events")}
          className={`px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "events"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          📅 Events
        </li>
        <li
          onClick={() => setActiveSection("messages")}
          className={`px-4 py-3 mb-2 cursor-pointer text-base rounded-md transition-all ${
            activeSection === "messages"
              ? "bg-purple-500 text-white"
              : "text-gray-800 hover:bg-purple-500 hover:text-white"
          }`}
        >
          ✉️ Messages
        </li>
      </ul>
    </div>
  );
}
