import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageEvents = () => {
  // State Management
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    venue: "",
    type: "",
    category: ""
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const accessToken = localStorage.getItem('access_token'); // Retrieve the access token from local storage

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/event/list", {
        headers: {
          'access_token': accessToken, // Include the access token in the headers
        },
      });
      console.log(response.data);
      if (response.data.responseCode === 200) {
        setEvents(Array.isArray(response.data.responseData) ? response.data.responseData : []);
      } else if (response.data.responseCode === 205) {
        alert(response.data.responseMessage); // Display the message to the user
        setEvents([]); // Clear events
      } else {
        console.error("Failed to fetch events:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]); // Set to empty array on error
    }
  };

  // Add a new event
  const handleAddEvent = async () => {
    // Check for mandatory fields
    if (!newEvent.title || !newEvent.description || !newEvent.start_date || !newEvent.end_date || !newEvent.type) {
      alert("Title, Description, Start Date, End Date, and Type are mandatory.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/event/add", newEvent, {
        headers: {
          'access_token': accessToken, // Include the access token in the headers
        },
      });
      if (response.data.responseCode === 200) {
        setEvents([...events, response.data.responseData]); // Add the new event to the list
        setNewEvent({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          venue: "",
          type: "",
          category: ""
        }); // Reset the new event form
      } else {
        console.error("Failed to add event:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Edit an event
  const handleEditEvent = async (event) => {
    setEditingEvent(event); // Set the event to be edited
  };

  // Save edited event
  const handleSaveEdit = async () => {
    // Check for mandatory fields
    if (!editingEvent.title || !editingEvent.description || !editingEvent.start_date || !editingEvent.end_date || !editingEvent.type) {
      alert("Title, Description, Start Date, End Date, and Type are mandatory.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/event/edit/?event_id=${editingEvent._id}`, editingEvent, {
        headers: {
          'access_token': accessToken, // Include the access token in the headers
        },
      });
      if (response.data.responseCode === 200) {
        // Fetch events again to refresh the list
        fetchEvents();
        setEditingEvent(null); // Clear the editing state
      } else {
        console.error("Failed to update event:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/event/delete/?event_id=${eventId}`, {
        headers: {
          'access_token': accessToken, // Include the access token in the headers
        },
      });
      if (response.data.responseCode === 200) {
        setEvents(events.filter(event => event._id !== eventId)); // Remove the deleted event from the list
      } else {
        console.error("Failed to delete event:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Fetch events when the component loads
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (term) => {
    const filtered = events.filter(event => event.title.toLowerCase().includes(term.toLowerCase()));
    setFilteredEvents(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>
      <div className="mb-6 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        
        {/* Date Fields with Legend */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Event Dates</legend>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              placeholder="Start Date"
              value={newEvent.start_date}
              onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
            <span className="mx-2">to</span>
            <input
              type="date"
              placeholder="End Date"
              value={newEvent.end_date}
              onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
        </fieldset>

        <input
          type="text"
          placeholder="Venue"
          value={newEvent.venue}
          onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
        />
        <select
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
        >
          <option value="">Select Event Type</option>
          <option value="ACADEMIC">Academic</option>
          <option value="CAMPUS">Campus</option>
        </select>
        {newEvent.type && (
          <select
            value={newEvent.category}
            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
          >
            <option value="">Select Category</option>
            {newEvent.type === 'ACADEMIC' ? (
              <>
                <option value="EXAM">Exam</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="LECTURE">Lecture</option>
              </>
            ) : (
              <>
                <option value="CULTURAL">Cultural</option>
                <option value="SPORTS">Sports</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
              </>
            )}
          </select>
        )}
        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white p-2 rounded m-4"
        >
          Add Event
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">All Events</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Venue</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(events) && events.map(event => (
            <tr key={event._id}>
              <td className="border p-2">{event.title}</td>
              <td className="border p-2">{event.description}</td>
              <td className="border p-2">{new Date(event.start_date).toLocaleDateString()}</td>
              <td className="border p-2">{event.end_date ? new Date(event.end_date).toLocaleDateString() : 'N/A'}</td>
              <td className="border p-2">{event.venue}</td>
              <td className="border p-2">{event.type}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="bg-green-500 text-white rounded p-2 mr-2 w-20"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="bg-red-500 text-white rounded p-2 mr-2 w-20"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Event Form */}
      {editingEvent && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Event</h2>
          <div className="space-y-8">
            <input
              type="text"
              placeholder="Event Title"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
            />
            <input
              type="text"
              placeholder="Description"
              value={editingEvent.description}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
            />
            <fieldset className=" p-4 rounded-md space-y-2 m-2">
              <legend className="text-lg font-semibold">Event Dates</legend>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={editingEvent.start_date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, start_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                />
                <span className="mx-2">to</span>
                <input
                  type="date"
                  placeholder="End Date"
                  value={editingEvent.end_date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, end_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                />
              </div>
            </fieldset>
            <input
  type="text"
  placeholder="Venue"
  value={newEvent.venue}
  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
  className="w-full px-4 py-2  border rounded-md focus:outline-none focus:ring focus:ring-gray-300 mt-4"
/>

<select
  value={newEvent.type}
  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300 mb-4"
/>

{newEvent.type && (
  <select
    value={newEvent.category}
    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300 mb-4"
  >
    <option value="">Select Category</option>
    {newEvent.type === 'ACADEMIC' ? (
      <>
        <option value="EXAM">Exam</option>
        <option value="HOLIDAY">Holiday</option>
        <option value="ASSIGNMENT">Assignment</option>
        <option value="LECTURE">Lecture</option>
      </>
    ) : (
      <>
        <option value="CULTURAL">Cultural</option>
        <option value="SPORTS">Sports</option>
        <option value="WORKSHOP">Workshop</option>
        <option value="SEMINAR">Seminar</option>
      </>
    )}
  </select>

            )}
            <div>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
              >
                Update Event
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ManageEvents;
