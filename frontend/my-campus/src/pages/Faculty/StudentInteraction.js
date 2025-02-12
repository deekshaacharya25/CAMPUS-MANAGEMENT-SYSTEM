import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function StudentInteraction() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({});
  const accessToken = localStorage.getItem('access_token');
  const userId = accessToken ? jwtDecode(accessToken).id : null;
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
    return () => { setMessages([]); }; // Clear messages when selected user changes
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users');
      const response = await axios.get('http://localhost:3000/api/user/list/students', {
        headers: { 'access_token': accessToken }
      });
      setUsers(response.data.responseData || []);
      console.log('Fetched users:', response.data.responseData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      console.log(`Fetching messages for user ${userId}`);
      const response = await axios.get(`http://localhost:3000/api/message/direct/conversation?userId=${userId}`, {
        headers: { 'access_token': accessToken }
      });
      const fetchedMessages = Array.isArray(response.data.responseData) ? response.data.responseData : [];
      console.log('Fetched messages:', fetchedMessages);
      setMessages(fetchedMessages);
      markMessagesAsRead(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (messages) => {
    console.log('Messages to process for marking as read:', messages);
    const unreadMessageIds = messages
      .filter(message => {
        const receiverId = message.receiver_id?._id || message.receiver_id;
        const isUnread = receiverId === userId && !message.isRead;
        console.log(`Message ${message._id} receiver_id: ${receiverId}, userId: ${userId}, isRead: ${message.isRead}, isUnread: ${isUnread}`);
        return isUnread;
      })
      .map(message => message._id);

    console.log('Unread message IDs:', unreadMessageIds);

    if (unreadMessageIds.length > 0) {
      try {
        console.log('Marking messages as read:', unreadMessageIds);
        await axios.put('http://localhost:3000/api/message/direct/read', { messageIds: unreadMessageIds }, { headers: { 'access_token': accessToken } });
        setMessages(prevMessages => prevMessages.map(message => {
          if (unreadMessageIds.includes(message._id)) {
            const updatedMessage = { ...message, isRead: true, updatedAt: new Date().toISOString() };
            console.log(`Message ${message._id} read at ${updatedMessage.updatedAt}`);
            return updatedMessage;
          }
          return message;
        }));
        setUnreadMessages(prevUnreadMessages => {
          const updatedUnreadMessages = { ...prevUnreadMessages };
          unreadMessageIds.forEach(id => {
            const senderId = messages.find(message => message._id === id).sender_id;
            if (updatedUnreadMessages[senderId]) {
              updatedUnreadMessages[senderId] -= 1;
              if (updatedUnreadMessages[senderId] === 0) {
                delete updatedUnreadMessages[senderId];
              }
            }
          });
          return updatedUnreadMessages;
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const handleUserSelect = async (user) => {
    console.log(`User selected: ${user._id}`);
    setSelectedUser(user);
    await fetchMessages(user._id);
    setUnreadMessages(prevUnreadMessages => {
      const updatedUnreadMessages = { ...prevUnreadMessages };
      delete updatedUnreadMessages[user._id];
      return updatedUnreadMessages;
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      console.log(`Sending message to ${selectedUser._id}: ${newMessage.trim()}`);
      const response = await axios.post('http://localhost:3000/api/message/direct/send', {
        receiver_id: selectedUser._id,
        content: newMessage.trim()
      }, {
        headers: { 'access_token': accessToken }
      });
      setMessages(prev => [...prev, response.data.responseData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - messageDate) / 60000);
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return messageDate.toLocaleDateString();
  };

  const MessageList = () => (
    <div className="flex-1 border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto">
      {messages.map((message) => {
        const senderId = message.sender_id?._id || message.sender_id;
        const isSender = senderId === userId;
        return (
          <div key={message._id} className={`mb-2 flex ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <div className={`break-words ${isSender ? 'text-white' : ''}`}>{message.content}</div>
              <div className="text-xs mt-1 opacity-75 text-right">
                {formatRelativeTime(message.createdAt)}
              </div>
              {!isSender && !message.isRead && (
                <div className="text-xs mt-1 text-red-500">Unread</div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Students</h2>
        <ul className="space-y-2">
          {Array.isArray(users) && users.map((user) => (
            <li
              key={user._id}
              className={`p-2 cursor-pointer rounded hover:bg-gray-100 
                ${selectedUser && selectedUser._id === user._id ? 'bg-gray-200' : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="flex items-center">
                {unreadMessages[user._id] && <span className="text-red-500 mr-2">●</span>}
                {user.name}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-4">Chat with {selectedUser.name}</h2>
            <MessageList />
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l p-2"
                placeholder="Type a message..."
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 
                  transition-colors disabled:bg-blue-300"
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a student to start a conversation
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentInteraction;