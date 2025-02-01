import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validator from 'validator';

const ResetPassword = () => {
  const [username, setUsername] = useState(''); // For email or phone
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // To manage steps (1: enter email/phone, 2: enter new password)
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (step === 1) {
      if (!username) {
        newErrors.username = "Email or Phone is required.";
      } else if (!validator.isEmail(username) && !/^\+91\d{10}$/.test(username)) {
        newErrors.username = "Invalid email or phone format.";
      }
    } else if (step === 2) {
      if (!password) {
        newErrors.password = "Password is required.";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    if (step === 1) {
      // Step 1: Send email/phone to backend to verify user
      try {
        const response = await fetch('http://localhost:3000/api/auth/reset-password/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }), // Send email or phone
        });

        const data = await response.json();

        if (response.ok) {
          alert('Verification successful! Please enter your new password.');
          setStep(2); // Move to step 2
        } else {
          alert(`Error: ${data.responseMessage}`);
        }
      } catch (error) {
        console.error('Error during verification:', error);
        alert(`An error occurred: ${error.message}`);
      }
    } else if (step === 2) {
      // Step 2: Send new password to backend
      try {
        const response = await fetch('http://localhost:3000/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }), // Send email/phone and new password
        });

        const data = await response.json();

        if (response.ok) {
          alert('Password reset successfully!');
          navigate('/'); // Redirect to login page after successful reset
        } else {
          alert(`Error: ${data.responseMessage}`);
        }
      } catch (error) {
        console.error('Error during password reset:', error);
        alert(`An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-bluegrey to-heather">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {step === 1 ? 'Reset Password' : 'Enter New Password'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Email or Phone Input */}
          {step === 1 && (
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
          )}

          {/* Step 2: New Password Input */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">New Password</label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
                  required
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-bluegrey focus:border-bluegrey"
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-bluegrey text-white py-2 rounded-md hover:bg-lightbluegrey transition duration-200"
          >
            {step === 1 ? 'Verify' : 'Reset Password'}
          </button>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-indigo-600 hover:text-indigo-900 transition duration-200">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 