import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaTimes } from 'react-icons/fa';

const AcademicCalendar = () => {
  const [events, setEvents] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchNotifications();
  }, []);

  const formatDateToLocalDate = (dateString) => {
    // Create date in local timezone without time component
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
  };

  const fetchEvents = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:3000/api/event/list`, {
        headers: {
          access_token: accessToken, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      console.log('Fetched events data:', data);

      const eventMap = {};
      if (data.responseData && Array.isArray(data.responseData)) {
        data.responseData.forEach(event => {
          if (!event.start_date) {
            console.warn('Event missing date:', event);
            return;
          }
          // Convert the date to local timezone and remove time component
          const dateStr = formatDateToLocalDate(event.start_date);
          if (!eventMap[dateStr]) {
            eventMap[dateStr] = [];
          }
          eventMap[dateStr].push(event);
        });
      }
      console.log('Event map:', eventMap); // Debug log to see final event mapping
      setEvents(eventMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get("http://localhost:3000/api/notifications/list", {
        headers: {
          "access_token": accessToken,
        },
      });
      if (response.data.responseCode === 200) {
        setNotifications(response.data.responseData);
      } else {
        console.error("Failed to fetch notifications:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.delete(`http://localhost:3000/api/notifications/${notificationId}`, {
        headers: {
          "access_token": accessToken,
        },
      });
      if (response.data.responseCode === 200) {
        setNotifications(notifications.filter(notification => notification._id !== notificationId));
      } else {
        console.error("Failed to delete notification:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  // Modified formatDate to handle timezone consistently
  const formatDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
  };

  const handleDateClick = (date) => setSelectedDate(date);

  // Rest of the component remains the same
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="p-2"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = formatDate(date);
      const hasEvents = events && events[dateStr]?.length > 0;
      const isSelected = selectedDate === dateStr;

      days.push(
        <td 
          key={day}
          className={`p-2 border text-center cursor-pointer transition-colors
            ${hasEvents ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-yellow-50'}
            ${isSelected ? 'bg-yellow-200' : ''}`}
          onClick={() => handleDateClick(dateStr)}
        >
          <div className="relative">
            {day}
            {hasEvents && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-600 rounded-full"></span>
            )}
          </div>
        </td>
      );

      if ((firstDayOfMonth + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(<tr key={day}>{days}</tr>);
        days = [];
      }
    }

    return weeks;
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    setSelectedDate(null);
  };

  if (loading) {
    return <div className="text-center p-4 text-yellow-800">Loading calendar...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-6 w-full">
        <div className="flex justify-end items-center mb-8">
          <div className="relative">
            <FaBell className="text-2xl cursor-pointer " onClick={toggleNotifications} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>
            )}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification._id} className="p-2 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                      </div>
                      <FaTimes
                        className="text-red-600 cursor-pointer ml-2"
                        onClick={() => deleteNotification(notification._id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 bg-white rounded-lg shadow-md h-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-yellow-800">Academic Calendar</h1>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => changeMonth(-1)} 
                  className="p-2 hover:bg-yellow-50 rounded-full text-yellow-800 transition-colors"
                >
                  ←
                </button>
                <h2 className="text-xl font-semibold text-yellow-800">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button 
                  onClick={() => changeMonth(1)} 
                  className="p-2 hover:bg-yellow-50 rounded-full text-yellow-800 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <th key={day} className="p-2 border text-yellow-800 bg-yellow-50">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderCalendar()}</tbody>
              </table>
            </div>
            
            {selectedDate && (
              <div className="mt-6 border-t border-yellow-200 pt-4">
                {events[selectedDate]?.length > 0 ? (
                  <div className="space-y-4">
                    {events[selectedDate].map((event, index) => (
                      <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">{event.title}</h4>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">No events scheduled for this date.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
