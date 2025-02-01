import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';

const LoginPage = () => {
  const [username, setUsername] = useState(''); // Combined state for email or phone
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(0); // Initialize role to 0
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!username) {
      newErrors.username = "Email or Phone is required.";
    } else if (!validator.isEmail(username) && !/^\+91\d{10}$/.test(username)) {
      newErrors.username = "Invalid email or phone format.";
    }
    
    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    // Prepare the data to be sent to the backend
    const userData = {
      username,
      password,
      role,
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json(); // Parse the response data

      // Check if the response indicates a successful login
      if (response.ok && data.responseCode === 200) {
        console.log("Response data:", data); // Log the entire response data

        // Store the token from responseData
        if (data.responseData) {
          localStorage.setItem("access_token", data.responseData); // Store the token in localStorage
          console.log("Access Token set:", data.responseData); // Log the token to confirm it's set
        } else {
          console.error("No access token received from the server.");
        }

        alert('Login successful!');

        // Check if role is defined
        if (data.responseData !== undefined) {
          // Redirect based on role
          switch (role) {
            case 1: // Admin role as number
              navigate('/admin/dashboard'); // Redirect to Admin Dashboard
              break;
            case 2: // Student role as number
              navigate('/student/dashboard');
              break;
            case 3: // Faculty role as number
              navigate('/faculty/dashboard');
              break;
          }
        } else {
          console.error("Role is undefined in response");
          alert("Login failed: Role is undefined");
        }
      } else {
        // Handle invalid login credentials
        alert(`Login failed: ${data.responseMessage}`); // Show the error message from the server
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-bluegrey to-heather">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex justify-between mb-4">
            {['admin', 'student', 'faculty'].map((roleType, index) => (
              <label
                key={roleType}
                className={`flex items-center cursor-pointer ${role === index + 1 ? 'text-bluegrey' : 'text-gray-600'}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={index + 1} // Set value as number (1, 2, 3)
                  checked={role === index + 1}
                  onChange={(e) => setRole(Number(e.target.value))} // Ensure this updates the role correctly
                  className="mr-2 accent-bluegrey"
                />
                {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
              </label>
            ))}
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Email or Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
              required
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
              required
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-bluegrey text-white py-2 rounded-md hover:bg-lightbluegrey transition duration-200"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link to="/reset-password" className="text-indigo-600 hover:text-indigo-900 transition duration-200">
              Forgot Password?
            </Link>
          </div>

          {/* Registration Link */}
          {role === 1 && ( // Check for numeric role 1 (admin)
            <div className="mt-4 text-center">
              <p className='text-sm'>Don't have an account? <Link to="/register" className='text-indigo-600 hover:text-indigo-900 transition duration-200'>Register here</Link></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
