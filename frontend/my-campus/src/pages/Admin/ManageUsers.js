import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import bcrypt from 'bcryptjs'; // Import bcryptjs
import profilePicture from '../../assets/profilepicture.jpg'; // Adjust the path as necessary

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]); // Add departments state
  const [newUser, setNewUser] = useState({ 
    name: "", 
    email: "", 
    role: 3, 
    phone: "", 
    password: "Campus@123", 
    image: profilePicture,
    departmentId: "" // Add departmentId to initial state
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedRole, setSelectedRole] = useState(""); // State for selected role

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
        console.log("Fetched Users:", response.data.responseData);
        if (response.data.responseCode === 200) {
            setUsers(response.data.responseData);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
  };

  const fetchDepartments = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
        const response = await axios.get("http://localhost:3000/api/department/list", {
            headers: {
                "access_token": accessToken,
            },
        });
        console.log("Raw department response:", response.data);
        
        if (response.data.responseCode === 200) {
            const departmentData = response.data.responseData;
            console.log("Setting departments:", departmentData);
            setDepartments(departmentData);
        } else {
            throw new Error(response.data.responseMessage || 'Failed to fetch departments');
        }
    } catch (error) {
        console.error("Department fetch error:", error);
        alert("Error loading departments. Please refresh the page.");
    }
  };

  useEffect(() => {
    if (!accessToken) {
      console.warn("No access token found in localStorage.");
      return;
    }

    fetchUsers();
    fetchDepartments(); // Fetch departments when component mounts
  }, [accessToken]);

  // Function to filter users based on search term and selected role
  const filteredUsers = users.filter(user => {
    const userName = user.name || ""; // Default to an empty string if user.name is undefined
    const matchesName = userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? user.role === Number(selectedRole) : true;
    const matchesDepartment = newUser.departmentId ? user.departmentId === newUser.departmentId : true; // Adjust this to filter by department if needed
    return matchesName && matchesRole && matchesDepartment;
  });

  const handleAddUser = async () => {
    const accessToken = localStorage.getItem("access_token");
    console.log("Access Token for adding user:", accessToken); // Log the access token for debugging

    if (!accessToken) {
        alert("No access token found.");
        return; // Exit if no token is found
    }

    try {
        const decodedToken = jwtDecode(accessToken);
        console.log("Decoded Token:", decodedToken); // Log the entire decoded token
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
      setNewUser({ name: "", email: "", phone: "", password: "Campus@123", role: 3, image: profilePicture, departmentId: "" }); // Reset the form with default values
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please check your permissions.");
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log("Attempting to delete user with ID:", userId); // Log the user ID
    const accessToken = localStorage.getItem("access_token");
    try {
        const response = await axios.delete(`http://localhost:3000/api/user/delete?u_id=${userId}`, {
            headers: {
                "access_token": accessToken,
            },
        });

        if (response.data.responseCode === 200) {
            alert("User deleted successfully!");
            fetchUsers(); // Refresh the user list after deletion
        } else {
            alert(`Failed to delete user: ${response.data.responseMessage}`);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
    }
  };

  const handleEditUser = (user) => {
    console.log("Editing user with data:", user);
    setCurrentUserId(user._id);
    setNewUser({
        ...user,
        departmentId: user.departmentId || "", // Ensure departmentId is set
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const accessToken = localStorage.getItem("access_token");
    
    console.log("Current user being edited:", currentUserId);
    console.log("Selected department:", newUser.departmentId);
    
    const updatedUser = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        departmentId: newUser.departmentId || null, 
        image: newUser.image
    };

    console.log("Sending update payload:", updatedUser);

    try {
        const response = await axios.put(
            `http://localhost:3000/api/user/edit/?u_id=${currentUserId}`,
            updatedUser,
            {
                headers: {
                    "access_token": accessToken,
                },
            }
        );

        console.log("Full update response:", response.data);

        if (response.data.responseCode === 200) {
            console.log("User updated successfully with department");
            await fetchUsers(); // Refresh the user list
            setIsEditing(false);
            setNewUser({ 
                name: "", 
                email: "", 
                phone: "", 
                password: "Campus@123", 
                role: 3, 
                image: profilePicture,
                departmentId: "" 
            });
            alert("User updated successfully!");
        } else {
            console.error("Update failed:", response.data);
            alert(`Failed to update user: ${response.data.responseMessage}`);
        }
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user. Please check console for details.");
    }
  };

  return (
    <div className="admin-page p-6 bg-gray-100 min-h-screen">
      <div className="admin-content bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">Manage Users</h1>
        
        {/* Search Bar */}
        <div className="mb-4 w-full flex flex-row">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mr-2 w-1/2"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-1/2"
          >
            <option value="">All Roles</option>
            <option value="1">Admin</option>
            <option value="2">Faculty</option>
            <option value="3">Student</option>
          </select>
        </div>

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
          <select
            value={newUser.departmentId}
            onChange={(e) => setNewUser({ ...newUser, departmentId: e.target.value })}
            className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 flex-1"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name || dept.title}
              </option>
            ))}
          </select>
          {isEditing ? (
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
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">
                    {(() => {
                        const dept = departments.find(dept => dept._id === user.departmentId);
                        return dept ? dept.name : 'Not Assigned';
                    })()}
                </td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => handleEditUser(user)} className="bg-green-500 text-white rounded p-2 mr-2 w-20">Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white rounded p-2 w-20 ">Delete</button>
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
