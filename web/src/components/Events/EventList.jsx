export function EventList({ events, onEventClick }) {
  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
          onClick={() => onEventClick(event)}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {event.name}
          </h2>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <p className="text-sm text-gray-500">{event.date}</p>
        </div>
      ))}
    </div>
  );
}
