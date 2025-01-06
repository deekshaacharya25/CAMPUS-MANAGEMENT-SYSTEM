import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const RegisterPage = () => {
  const [role, setRole] = useState('student');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registering as ${role}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-bluegrey to-heather">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex justify-between mb-4">
            {['admin', 'student', 'faculty'].map((roleType) => (
              <label
                key={roleType}
                className={`flex items-center cursor-pointer ${role === roleType ? 'text-bluegrey' : 'text-gray-600'}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={roleType}
                  checked={role === roleType}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 accent-bluegrey"
                />
                {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
              </label>
            ))}
          </div>

          {/* Email or Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Email / Phone</label>
            <input
              type="text"
              placeholder="Enter your email / phone number"
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
            Register
          </button>
        </form>
        <div>
        <p className='text-sm m-4'>Already have an account? <Link to="/loginpage" className='text-indigo-600 hover:text-indigo-900 transition duration-200'>Login here</Link></p>
      </div>
      
      </div>
    </div>
  );
};

export default RegisterPage;