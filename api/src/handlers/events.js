import { db } from "../util/db.js";

export async function getEvents(req, res) {
  const { course_id } = req.query;
  try {
    const query = db("events");
    if (course_id) {
      query.where({ "events.course_id": course_id });
    }
    query
      .select("events.*", "courses.name AS course_name")
      .leftJoin("courses", "courses.course_id", "events.course_id");
    const result = await query;
    return res.json(result);
  } catch (err) {
    console.log("Error fetching events:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getEventById(req, res) {
  const { id } = req.params;

  try {
    const result = await db("events")
      .where({ event_id: id })
      .select("events.*", "courses.name AS course_name")
      .leftJoin("courses", "courses.course_id", "events.course_id")
      .first();

    if (!result) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error fetching event:", err);

    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
}
export async function createEvent(req, res) {
  const {
    name,
    related_assignment_id,
    event_date,
    description,
    course_id,
    start_time,
    end_time,
    location,
  } = req.body;
  console.log("Creating event with data:", req.body);
  try {
    const [newEvent] = await db("events")
      .insert({
        course_id,
        name,
        related_assignment_id,
        description,
        event_date,
        start_time,
        end_time,
        location,
      })
      .returning("*");
    return res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function updateEvent(req, res) {
  const { id } = req.params;
  const {
    name,
    related_assignment_id,
    event_date,
    description,
    course_id,
    start_time,
    end_time,
  } = req.body;

  try {
    const [updatedEvent] = await db("events").where({ event_id: id }).update(
      {
        course_id,
        name,
        related_assignment_id,
        description,
        event_date,
        start_time,
        end_time,
      },
      ["*"]
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function deleteEvent(req, res) {
  const { id } = req.params;

  try {
    const result = await db("events").where({ event_id: id }).del();

    if (!result) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting event:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
