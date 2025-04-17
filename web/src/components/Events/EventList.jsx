import { EventDetails } from "./EventDetails";

export function EventList({ events, onEventClick }) {
  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <EventDetails key={event.id} event={event} />
      ))}
    </div>
  );
}
