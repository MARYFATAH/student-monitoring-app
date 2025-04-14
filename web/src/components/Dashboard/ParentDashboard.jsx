import React, { useState } from "react";
import { SideBar } from "./SideBar";

import { EventList } from "../Events/EventList"; // Displays events related to their children
import { StudentProfile } from "../Students/StudentProfile";

export function ParentDashboard() {
  const [activeSection, setActiveSection] = useState("students");

  return (
    <div className="h-screen flex bg-gradient-to-r from-purple-200 to-violet-200">
      {/* Sidebar */}
      <SideBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className="w-1/4 bg-green-600 text-white shadow-md"
      />

      {/* Main Content */}
      <div className="flex-grow p-6">
        {/* Students Section */}
        {activeSection === "students" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Student profile
            </h1>
            <StudentProfile />
          </div>
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Events</h1>
            <EventList />
          </div>
        )}

        {/* Messages Section */}
        {activeSection === "messages" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
            <p>Parents can view messages here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
