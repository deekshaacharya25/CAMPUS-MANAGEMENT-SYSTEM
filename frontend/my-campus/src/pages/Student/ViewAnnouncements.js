import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [view, setView] = useState('received'); // 'received' or 'sent'
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
    fetchAnnouncements();
  }, [view]);

  const fetchAnnouncements = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const endpoint = view === 'sent' ? '/api/announcement/sent' : '/api/announcement';
      
      const response = await axios.get(`http://localhost:3000/api/message/announcement`, {
        headers: { access_token: accessToken },
      });

      if (response.data.responseCode === 200) {
        setAnnouncements(response.data.responseData.announcements);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-800">Announcements</h1>
          {['TEACHER', 'ADMIN'].includes(userRole) && (
            <div className="flex space-x-4">
              <button
                onClick={() => setView('received')}
                className={`px-4 py-2 rounded-md ${
                  view === 'received'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Received
              </button>
              <button
                onClick={() => setView('sent')}
                className={`px-4 py-2 rounded-md ${
                  view === 'sent'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sent
              </button>
            </div>
          )}
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No announcements found.</p>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="border border-yellow-100 rounded-lg p-4 hover:bg-yellow-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        From: {announcement.sender_id?.name || 'Unknown'} • 
                        {formatDate(announcement.createdAt)}
                      </p>
                      <p className="text-gray-700 mb-2">
                        {selectedAnnouncement === announcement._id
                          ? announcement.content
                          : announcement.content.length > 150
                          ? `${announcement.content.substring(0, 150)}...`
                          : announcement.content}
                      </p>
                      {announcement.content.length > 150 && (
                        <button
                          onClick={() =>
                            setSelectedAnnouncement(
                              selectedAnnouncement === announcement._id ? null : announcement._id
                            )
                          }
                          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                        >
                          {selectedAnnouncement === announcement._id ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAnnouncements;
