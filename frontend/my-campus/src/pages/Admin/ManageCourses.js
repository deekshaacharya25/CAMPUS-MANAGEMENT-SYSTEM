import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure correct import
import bcrypt from 'bcryptjs';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    facultyId: "",
    faculty_name: "",
  });
  const [editingCourse, setEditingCourse] = useState({
    title: "",
    description: "",
    facultyId: "",
    faculty_name: "",
  });
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const accessToken = localStorage.getItem("access_token");
  console.log("Access Token:", accessToken);

  const fetchCourses = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get("http://localhost:3000/api/course/list", {
        headers: {
          "access_token": accessToken,
        },
      });
      console.log("Fetched Courses:", response.data); // Log fetched courses
      if (response.data.responseCode === 200) {
        setCourses(response.data.responseData); // Update courses state
      } else {
        console.error("Failed to fetch courses:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      console.warn("No access token found in localStorage.");
      return;
    }

    fetchCourses();
  }, [accessToken]);

  // Log courses whenever they change
  useEffect(() => {
    console.log("Courses state updated:", courses);
  }, [courses]);

  const fetchFaculties = async () => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve the access token
    console.log("Access Token:", accessToken); // Log the access token
    try {
        const response = await axios.get("http://localhost:3000/api/user/list/faculties", {
            headers: {
                "access_token": accessToken, // Use custom header for access token
            },
        });
        console.log("API Response:", response); // Log the entire response object
        console.log("Response Data:", response.data); // Log the data part of the response
        console.log("Response Data (responseData):", response.data.responseData); // Log the specific part
        if (response.data.responseCode === 200) {
            setFaculties(response.data.responseData); // Ensure this matches the structure of the response
            setFilteredFaculties(response.data.responseData); // Initialize filtered faculties with all fetched faculties
        } else {
            console.error("Failed to fetch faculties:", response.data.responseMessage);
        }
    } catch (error) {
        console.error("Error fetching faculties:", error); // Log the error
    }
  };

  const handleAddCourse = async () => {
    const accessToken = localStorage.getItem("access_token");
    console.log("Access Token for adding course:", accessToken); // Log the access token for debugging

    if (!accessToken) {
        alert("No access token found.");
        return; // Exit if no token is found
    }

    // Log the token before decoding
    console.log("Access Token for decoding:", accessToken);

    try {
        const decodedToken = jwtDecode(accessToken);
        console.log("Decoded Token:", decodedToken); // Log the entire decoded token
        console.log("course Role:", decodedToken.role); // Check the role
    } catch (error) {
        console.error("Error decoding token:", error); // Log any errors during decoding
        alert("Invalid token. Please log in again.");
        return;
    }

    // Prepare the course data without password hashing
    const courseToAdd = {
        ...newCourse,
        // Remove password if not needed
        // password: hashedPassword, // Comment this out if not using password
    };

    try {
        const response = await axios.post("http://localhost:3000/api/course/add", courseToAdd, {
            headers: {
                "access_token": accessToken,
            },
        });

        console.log("API Response:", response.data); // Log the entire response

        if (response.data.responseCode === 200) {
            const newCourseData = response.data.responseData; // Extract the new course data
            console.log("New Course Data:", newCourseData); // Log the new course data
            setCourses(prevCourses => [...prevCourses, newCourseData]); // Update the courses state with the new course
            alert("Course added successfully!"); // Notify course of success
            fetchCourses(); // Refresh the course list immediately after adding a course
        } else {
            console.error("Failed to add course:", response.data.responseMessage);
            alert(`Failed to add course: ${response.data.responseMessage}`);
        }

        // Reset the form or state for new course input
        setNewCourse({ title: "", description: "", facultyId: "", faculty_name: "" }); // Reset the form with default values
    } catch (error) {
        console.error("Error adding course:", error);
        alert("Failed to add course. Please check your permissions.");
    }

    console.log("Updated courses State:", courses); // Log the updated courses state
  };

  const handleEditCourse = (course) => {
    setCurrentCourseId(course._id);
    setEditingCourse(course);
  };

  const handleSaveEdit = async () => {
    const accessToken = localStorage.getItem("access_token");
    const updatedCourse = {
      ...editingCourse,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/course/edit/?course_id=${currentCourseId}`, // Correct query param
        updatedCourse,
        {
          headers: {
            "access_token": accessToken, // Ensure token is sent
          },
        }
      );

      if (response.data.responseCode === 200) {
        alert("Course updated successfully!");
        fetchCourses(); // Refresh the list
        setEditingCourse({ title: "", description: "", facultyId: "", faculty_name: "" });
      } else {
        alert(`Failed to update course: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    console.log("Attempting to delete course with ID:", courseId); // Log the course ID
    const accessToken = localStorage.getItem("access_token");
    try {
      // Use the query parameter format for the DELETE request
      const response = await axios.delete(`http://localhost:3000/api/course/delete?course_id=${courseId}`, {
        headers: {
          "access_token": accessToken,
        },
      });

      if (response.data.responseCode === 200) {
        alert("Course deleted successfully!");
        fetchCourses(); // Refresh the course list after deletion
      } else {
        alert(`Failed to delete course: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFaculties();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Update search term

    if (value) {
      const trimmedSearchTerm = value.trim().toLowerCase(); // Trim and convert to lowercase
      const filtered = faculties.filter(faculty => {
        const name = faculty.name.trim().toLowerCase(); // Trim and convert to lowercase
        return name.includes(trimmedSearchTerm);
      });
      setFilteredFaculties(filtered);
      setIsSearchClicked(true);
    } else {
      setFilteredFaculties([]); // Clear filtered faculties if search term is empty
      setIsSearchClicked(false);
    }
  };

  const selectFaculty = (faculty) => {
    setNewCourse({ ...newCourse, facultyId: faculty._id, faculty_name: faculty.name });
    setSearchTerm(faculty.name); // Set the input to the selected faculty name
    setFilteredFaculties([]); // Clear the filtered faculties
    setIsSearchClicked(false);
  };

  const handleUpdateCourse = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
        alert("No access token found.");
        return; // Exit if no token is found
    }

    try {
        const response = await axios.put(`http://localhost:3000/api/course/update/${editingCourse._id}`, editingCourse, {
            headers: {
                "access_token": accessToken,
            },
        });

        if (response.data.responseCode === 200) {
            const updatedCourseData = response.data.responseData; // Extract the updated course data
            setCourses(prevCourses => prevCourses.map(course => course._id === updatedCourseData._id ? updatedCourseData : course)); // Update the courses state
            alert("Course updated successfully!"); // Notify course of success
            fetchCourses(); // Refresh the course list immediately after updating a course
        } else {
            console.error("Failed to update course:", response.data.responseMessage);
            alert(`Failed to update course: ${response.data.responseMessage}`);
        }

        // Reset the form or state for new course input
        setEditingCourse({ title: "", description: "", facultyId: "", faculty_name: "" }); // Reset editing course state
    } catch (error) {
        console.error("Error updating course:", error);
        alert("Failed to update course. Please check your permissions.");
    }
  };

  // Function to handle canceling the edit
  const handleCancelEdit = () => {
    setEditingCourse(null); // Reset the editing course state to hide the edit form
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Manage Courses
        </h1>

        {/* Add Course Form */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Course
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search Faculty"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsSearchClicked(true)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
              />
              {isSearchClicked && filteredFaculties.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto z-10">
                  {filteredFaculties.map((faculty) => (
                    <li
                      key={faculty._id}
                      onClick={() => selectFaculty(faculty)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {faculty.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={handleAddCourse} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add Course
            </button>
          </div>
        </section>

        {/* Courses Table */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            All Courses
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Faculty Name</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  // Find the faculty name based on facultyId
                  const faculty = faculties.find(faculty => faculty._id === course.facultyId);
                  return (
                    <tr
                      key={course._id}
                      className="text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 border-b">{course.title}</td>
                      <td className="px-4 py-2 border-b">{course.description}</td>
                      <td className="px-4 py-2 border-b">{faculty ? faculty.name : "N/A"}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edit Course Form */}
        {editingCourse && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Edit Course
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                value={editingCourse.title}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
              />
              <input
                type="text"
                placeholder="Description"
                value={editingCourse.description}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
              />
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search Faculty"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchClicked(true)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                />
                {isSearchClicked && filteredFaculties.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto z-10">
                    {filteredFaculties.map((faculty) => (
                      <li
                        key={faculty._id}
                        onClick={() => selectFaculty(faculty)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {faculty.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                >
                  Update Course
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
