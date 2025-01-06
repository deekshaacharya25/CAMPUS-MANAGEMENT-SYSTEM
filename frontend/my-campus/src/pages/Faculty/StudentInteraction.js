import React, { useState, useEffect } from 'react';

const StudentInteraction = () => {
  const [messages, setMessages] = useState([]); // Stores the list of messages
  const [newMessage, setNewMessage] = useState(''); // Stores the message being typed

  useEffect(() => {
    // Simulate fetching messages from an API
    const fetchMessages = async () => {
      const exampleMessages = [
        { id: 1, sender: 'Student: John Doe', content: 'Can you clarify the assignment deadline?' },
        { id: 2, sender: 'Faculty: Dr. Smith', content: 'The deadline is January 10th, 2025.' },
        { id: 3, sender: 'Student: Jane Smith', content: 'I’m facing issues with the course materials.' },
      ];
      setTimeout(() => setMessages(exampleMessages), 1000); // Simulated delay
    };

    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), sender: 'Faculty: You', content: newMessage },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Student Interaction</h1>
      <p className="text-gray-600 mb-4">Interact with your students and view messages here.</p>

      <div className="border rounded-md p-4 mb-4 bg-gray-50 h-64 overflow-y-scroll">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet...</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="mb-3">
              <p>
                <strong>{message.sender}:</strong> {message.content}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md mr-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default StudentInteraction;
