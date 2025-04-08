export function EventDetails({ event }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.name}</h1>
      <p className="text-lg text-gray-600 mb-6">{event.description}</p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-700">Date:</span> {event.date}
      </p>
    </div>
  );
}
