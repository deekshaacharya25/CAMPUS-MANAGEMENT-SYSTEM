import React, { useState, useEffect } from "react"; // Adjust the path as necessary
import ProfileImage from '../../assets/profilepicture.jpg';
import axios from "axios"; // Import axios for making HTTP requests
import { jwtDecode } from "jwt-decode"; // Correctly import the named export

const MyProfile = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("access_token"); // Retrieve the access token

      if (!accessToken || accessToken.split('.').length !== 3) {
        console.error("Invalid access token.");
        alert("Invalid access token. Please log in again.");
        return;
      }

      let studentId;
      try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          console.error("Access token has expired.");
          alert("Access token has expired. Please log in again.");
          return;
        }
        studentId = decodedToken.id; // Adjust this based on your token structure
        console.log("Extracted Student ID:", studentId); // Log the extracted student ID
      } catch (error) {
        console.error("Failed to decode access token:", error);
        alert("Invalid access token.");
        return;
      }

      try {
        // Fetch all students
        const response = await axios.get(`http://localhost:3000/api/user/list/students`, {
          headers: {
            'access_token': accessToken, // Include the access token in the headers
          },
        });

        console.log("API Response Data:", response.data); // Log the entire response for debugging

        if (response.data.responseCode === 200) {
          // Find the logged-in student based on the studentId
          const loggedInStudent = response.data.responseData.find(student => student._id === studentId);

          if (loggedInStudent) {
            setStudent(loggedInStudent);
            setUpdatedStudent(loggedInStudent); // Initialize updatedStudent with fetched data
          } else {
            console.error("Logged-in student not found in the list.");
            alert("Profile not found.");
          }
        } else {
          console.error("Failed to fetch students:", response.data.responseMessage);
          alert("Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching student profile:", error.response ? error.response.data : error.message);
        alert("An error occurred while fetching the profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token

    try {
      const response = await axios.put(`http://localhost:3000/api/user/edit/${student._id}`, updatedStudent, {
        headers: {
          "Content-Type": "application/json",
          'access_token': accessToken, // Include the access token in the headers
        },
      });

      if (response.data.responseCode === 200) {
        setStudent(response.data.responseData);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error updating student profile:", error);
    }
  };

  if (!student) {
    return <p>Loading profile...</p>;
  }

  // Construct the image URL
  const imageUrl = student.image && student.image.length > 0 ? `http://localhost:3000/api/user/list/${student.image[0]}` : ProfileImage;

  return (
    <div className="profile-page bg-white p-6 rounded shadow-md flex flex-col items-center gap-8">
      {/* Left Section: Profile Photo */}
      <div className="flex justify-center items-center">
        <img
          src={imageUrl}
          alt="Student Avatar"
          className="rounded-full w-48 h-48 object-cover border border-gray-300"
        />
      </div>

      {/* Right Section: Profile Details */}
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={updatedStudent.name}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              placeholder="Name"
            />
            <input
              type="text"
              name="rollno"
              value={updatedStudent.rollno}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              placeholder="Roll Number"
            />
            <input
              type="email"
              name="email"
              value={updatedStudent.email}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              placeholder="Email"
            />
            <input
              type="text"
              name="department"
              value={updatedStudent.department}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              placeholder="Department"
            />
            <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Save</button>
          </>
        ) : (
          <>
            <p className="text-lg"><strong>Name:</strong> {student.name}</p>
            <p className="text-lg"><strong>Roll Number:</strong> {student.rollno}</p>
            <p className="text-lg"><strong>Email:</strong> {student.email}</p>
            <p className="text-lg"><strong>Department:</strong> {student.department}</p>
            <button onClick={handleEditToggle} className="bg-green-500 text-white p-2 rounded">Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
