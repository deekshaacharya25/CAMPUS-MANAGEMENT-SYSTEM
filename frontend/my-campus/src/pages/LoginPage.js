import React, { useState } from 'react';

const LoginPage = () => {
  const [role, setRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in as ${role}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-indigo-400">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex justify-between mb-4">
            {['admin', 'student', 'faculty'].map((roleType) => (
              <label
                key={roleType}
                className={`flex items-center cursor-pointer ${role === roleType ? 'text-indigo-600' : 'text-gray-600'}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={roleType}
                  checked={role === roleType}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 accent-indigo-600"
                />
                {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
              </label>
            ))}
          </div>

          {/* Email or Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
