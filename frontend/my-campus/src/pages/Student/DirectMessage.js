import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function DirectMessage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const accessToken = localStorage.getItem('access_token');
  const userId = accessToken ? jwtDecode(accessToken).id : null; // Decode the token to get the user ID

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/list', {
        headers: { 'access_token': accessToken }
      });
      setUsers(response.data.responseData || []); // Ensure the response is an array
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set users to an empty array on error
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/message/direct/conversation?userId=${userId}`, {
        headers: { 'access_token': accessToken }
      });
      setMessages(response.data.responseData || []); // Ensure the response is an array
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]); // Set messages to an empty array on error
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/message/direct/send', {
        receiver_id: selectedUser._id,
        content: newMessage
      }, {
        headers: { 'access_token': accessToken }
      });
      setMessages([...messages, response.data.responseData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className={`p-2 cursor-pointer ${selectedUser && selectedUser._id === user._id ? 'bg-gray-200' : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-4">Chat with {selectedUser.name}</h2>
            <div className="flex-1 border border-gray-300 p-4 mb-4 overflow-y-auto">
              {messages.map((message) => (
                <div key={message._id} className={`mb-2 ${message.sender_id === userId ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded ${message.sender_id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-l"
                placeholder="Type a message..."
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a user to start a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DirectMessage;