import React, { useState } from 'react';
import axios from 'axios';

function SendAnnouncements() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await axios.post('http://localhost:3000/api/message/announcement/send', {
        title,
        content,
      }, {
        headers: { 'access_token': accessToken },
      });

      if (response.data.responseCode === 200) {
        setSuccessMessage('Announcement sent successfully!');
        setTitle('');
        setContent('');
      } else {
        setErrorMessage('Failed to send announcement.');
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
      setErrorMessage('Failed to send announcement.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-yellow-800 mb-4">Send Announcement</h1>
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSendAnnouncement}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="6"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendAnnouncements;