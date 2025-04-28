export function EventDetails({ event }) {
  const eventDate = new Date(event.date);

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto h-[65vh] overflow-y-auto">
      {/* Top Section - Calendar Header */}
      <div className="bg-violet-500 text-white rounded-t-lg px-4 py-3 text-center shadow">
        <h2 className="text-lg font-bold">Next Event</h2>
      </div>

      {/* Calendar Layout */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Left Column - Date Block */}
        <div className="flex flex-col items-center bg-violet-50 rounded-lg shadow-md p-4">
          <span className="text-3xl font-extrabold text-violet-800">
            {eventDate.toLocaleDateString("en-US", { day: "2-digit" })}
          </span>
          <span className="text-lg text-violet-600">
            {eventDate.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-sm text-violet-500">
            {eventDate.toLocaleDateString("en-US", { weekday: "long" })}
          </span>
        </div>

        {/* Middle Column - Event Info */}
        <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-3 break-words">
            {event.name || "Event Name"}
          </h1>
          <p className="text-base text-gray-600 mb-4 break-words">
            {event.description || "No description available."}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Location: </span>
            {event.location || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}
