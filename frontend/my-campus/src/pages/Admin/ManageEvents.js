import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageEvents = () => {
  // State Management
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Add a new event
  const addEvent = async () => {
    try {
      await axios.post("/api/events", newEvent);
      setNewEvent({ title: "", description: "", date: "", location: "" });
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Edit an event
  const updateEvent = async () => {
    try {
      await axios.put(`/api/events/${editingEvent._id}`, editingEvent);
      setEditingEvent(null); // Reset editing state
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Delete an event
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Fetch events when the component loads
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Manage Events</h1>

        {/* Add New Event Form */}
        <div className="add-event-form">
          <h2>Add New Event</h2>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <textarea
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          ></textarea>
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          />
          <button onClick={addEvent}>Add Event</button>
        </div>

        {/* Event List */}
        <h2>All Events</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <button onClick={() => setEditingEvent(event)}>Edit</button>
                  <button onClick={() => deleteEvent(event._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Event Form */}
        {editingEvent && (
          <div className="edit-event-form">
            <h2>Edit Event</h2>
            <input
              type="text"
              placeholder="Event Title"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            />
            <textarea
              placeholder="Event Description"
              value={editingEvent.description}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            ></textarea>
            <input
              type="date"
              value={editingEvent.date}
              onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={editingEvent.location}
              onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
            />
            <button onClick={updateEvent}>Update Event</button>
            <button onClick={() => setEditingEvent(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
