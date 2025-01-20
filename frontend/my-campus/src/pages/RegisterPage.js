import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare the data to be sent to the backend
    const userData = {
      name,
      email,
      phone,
      password,
      role: 1, // Assuming 1 is for ADMIN, but this is not needed as per your backend logic
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registration successful!');
        navigate('/'); // Redirect to login page after successful registration
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.responseMessage}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-bluegrey to-heather">
      <div className="bg-white shadow-xl rounded-lg p-4 w-full mt-12 max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Admin Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Phone</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Password</label>
            <input
              type="password"
              placeholder="Create your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-bluegrey text-white py-2 rounded-md hover:bg-lightbluegrey transition duration-200"
          >
            Register as Admin
          </button>
        </form>
        <div>
          <p className='text-sm m-4'>Already have an account? <Link to="/" className='text-indigo-600 hover:text-indigo-900 transition duration-200'>Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;