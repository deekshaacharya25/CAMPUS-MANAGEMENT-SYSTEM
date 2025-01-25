import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import bcrypt from 'bcryptjs'; // Import bcryptjs
import profilePicture from '../../assets/profilepicture.jpg'; // Adjust the path as necessary

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: 3, phone: "", password: "Campus@123", image: profilePicture });
  const [editingUser, setEditingUser] = useState(null);

  const accessToken = localStorage.getItem("access_token");
  console.log("Access Token:", accessToken);

  const fetchUsers = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
        const response = await axios.get("http://localhost:3000/api/user/list", {
            headers: {
                "access_token": accessToken,
            },
        });
        console.log("Fetched Users:", response.data); // Log fetched users
        if (response.data.responseCode === 200) {
            setUsers(response.data.responseData); // Update users state
        } else {
            console.error("Failed to fetch users:", response.data.responseMessage);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      console.warn("No access token found in localStorage.");
      return;
    }

    fetchUsers();
  }, [accessToken]);

  // Log users whenever they change
  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  // Add a new user
  const handleAddUser = async () => {
    const accessToken = localStorage.getItem("access_token");
    console.log("Access Token for adding user:", accessToken); // Log the access token for debugging

    if (!accessToken) {
        alert("No access token found.");
        return; // Exit if no token is found
    }

    // Log the token before decoding
    console.log("Access Token for decoding:", accessToken);

    try {
        const decodedToken = jwtDecode(accessToken);
        console.log("Decoded Token:", decodedToken); // Log the entire decoded token
        console.log("User Role:", decodedToken.role); // Check the role
    } catch (error) {
        console.error("Error decoding token:", error); // Log any errors during decoding
        alert("Invalid token. Please log in again.");
        return; // Exit if token is invalid
    }

    // Hash the password before sending it to the backend
    const saltRounds = 10; // Define the number of salt rounds
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds); // Hash the password

    const userToAdd = {
      ...newUser,
      password: hashedPassword, // Use the hashed password
    };

    try {
      const response = await axios.post("http://localhost:3000/api/user/add", userToAdd, {
        headers: {
          "access_token": accessToken, // Send token in access_token header
        },
      });

      console.log("API Response:", response.data); // Log the entire response

      if (response.data.responseCode === 200) {
        const newUserData = response.data.responseData; // Extract the new user data
        console.log("New User Data:", newUserData); // Log the new user data
        setUsers(prevUsers => [...prevUsers, newUserData]); // Update the users state with the new user
        alert("User added successfully!"); // Notify user of success
        fetchUsers(); // Refresh the user list immediately after adding a user
      } else {
        console.error("Failed to add user:", response.data.responseMessage);
        alert(`Failed to add user: ${response.data.responseMessage}`);
      }

      // Reset the form or state for new user input
      setNewUser({ name: "", email: "", phone: "", password: "Campus@123", role: 3, image: profilePicture }); // Reset the form with default values
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please check your permissions.");
    }

    console.log("Updated Users State:", users); // Log the updated users state
  };

  // Delete a user
  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:3000/api/user/delete?id=${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // Handle editing a user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, role: user.role, phone: user.phone, password: user.password, image: user.image });
  };

  // Save edited user
  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:3000/api/user/edit?u_id=${editingUser._id}`, newUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setUsers(users.map((user) => (user._id === editingUser._id ? response.data : user)));
        setEditingUser(null);
        setNewUser({ name: "", email: "", role: 3, phone: "", password: "Campus@123", image: profilePicture });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="admin-page p-6 bg-gray-100 min-h-screen">
      <div className="admin-content bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <div className="add-user-form mb-6 flex flex-col md:flex-row md:items-center">
          <input type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 flex-1" />
          <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 flex-1" />
          <input type="text" placeholder="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 flex-1" />
          <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 flex-1" />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: Number(e.target.value) })} className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 flex-1">
            <option value={1}>Admin</option>
            <option value={2}>Faculty</option>
            <option value={3}>Student</option>
          </select>
          {editingUser ? (
            <button onClick={handleSaveEdit} className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 transition duration-200">Save Changes</button>
          ) : (
            <button onClick={handleAddUser} className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200">Add User</button>
          )}
        </div>

        <table className="user-table w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">
                <button className="bg-green-500 text-white rounded p-2 mr-2 w-20">Edit</button>
                <button className="bg-red-500 text-white rounded p-2 w-20 ">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
