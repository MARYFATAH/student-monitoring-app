export function EventDetails({ event }) {
  const eventDate = new Date(event.date);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      {/* Top Section - Calendar Header */}
      <div className="bg-blue-500 text-white rounded-t-lg px-4 py-2 text-center">
        <h2 className="text-xl font-bold">Next Event</h2>
      </div>

      {/* Calendar Layout */}
      <div className="grid grid-cols-3 gap-4 p-6">
        {/* Left Column - Date Block */}
        <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4">
          <span className="text-4xl font-extrabold text-blue-600">
            {eventDate.toLocaleDateString("en-US", { day: "2-digit" })}
          </span>
          <span className="text-lg text-gray-600">
            {eventDate.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-sm text-gray-500">
            {eventDate.toLocaleDateString("en-US", { weekday: "long" })}
          </span>
        </div>

        {/* Middle Column - Event Info */}
        <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 break-words">
            {event.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4 sm:mb-0 sm:mr-4 sm:w-1/2 break-words">
            {event.description || "No description available."}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700 break-words">
              Location:
            </span>{" "}
            {event.location || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}
