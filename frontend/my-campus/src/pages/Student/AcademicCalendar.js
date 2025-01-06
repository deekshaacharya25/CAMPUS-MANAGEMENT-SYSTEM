import React, { useState, useEffect } from 'react';

const AcademicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    // Fetching events from the API
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Replace this URL with the actual endpoint from your backend
      const response = await fetch('https://your-api-url.com/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data); // Assuming the data is an array of events
      setLoading(false); // Set loading to false after data is fetched
      checkUpcomingEvents(data); // Check for upcoming events
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const checkUpcomingEvents = (events) => {
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > now && eventDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    });

    if (upcomingEvents.length > 0) {
      upcomingEvents.forEach(event => {
        // Trigger browser notification for each upcoming event
        sendNotification(event);
      });
    }
  };

  const sendNotification = (event) => {
    // Check if the browser supports notifications
    if (Notification.permission === "granted") {
      new Notification(`Upcoming Event: ${event.title}`, {
        body: `Date: ${event.date}`,
        icon: '/path-to-your-icon.png', // You can replace this with an actual icon
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(`Upcoming Event: ${event.title}`, {
            body: `Date: ${event.date}`,
            icon: '/path-to-your-icon.png',
          });
        }
      });
    }

    setNotifications((prev) => [...prev, event]);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Academic Calendar</h1>
      <p className="text-gray-600 mb-4">
        View the academic calendar for the current session and get notifications for upcoming deadlines and events.
      </p>
      
      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : (
        <>
          <div className="border rounded-md p-4 bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
            {events.length === 0 ? (
              <p className="text-gray-500">No upcoming events.</p>
            ) : (
              <ul className="list-disc list-inside">
                {events.map((event) => (
                  <li key={event.id} className="mb-2">
                    <strong>{event.title}</strong> - {event.date}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Notifications</h2>
              <ul className="list-disc list-inside">
                {notifications.map((notification, index) => (
                  <li key={index}>
                    <strong>{notification.title}</strong> - {notification.date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AcademicCalendar;
