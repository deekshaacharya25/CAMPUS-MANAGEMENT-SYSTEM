import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    facultyId: "",
    faculty_name: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const accessToken = localStorage.getItem("access_token");

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/course/list", {
        headers: {
          "access_token": accessToken,
        },
      });
      if (response.data.responseCode === 200) {
        setCourses(response.data.responseData);
      } else {
        console.error("Failed to fetch courses:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/list/faculties", {
        headers: {
          "access_token": accessToken,
        },
      });
      if (response.data.responseCode === 200) {
        setFaculties(response.data.responseData);
        setFilteredFaculties(response.data.responseData);
      } else {
        console.error("Failed to fetch faculties:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCourses();
      fetchFaculties();
    }
  }, [accessToken]);

  const filteredCourses = courses.filter(course => {
    return course.title.toLowerCase().includes(searchKey.toLowerCase());
  });

  const handleAddCourse = async () => {
    if (!accessToken) {
      alert("No access token found.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/course/add", newCourse, {
        headers: {
          "access_token": accessToken,
        },
      });

      if (response.data.responseCode === 200) {
        alert("Course added successfully!");
        fetchCourses();
        setNewCourse({ title: "", description: "", facultyId: "", faculty_name: "" });
        setSearchTerm("");
      } else {
        alert(`Failed to add course: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please check your permissions.");
    }
  };

  const handleEditCourse = (course) => {
    setCurrentCourseId(course._id);
    setEditingCourse(course);
    setEditSearchTerm(course.faculty_name || '');
  };

  const handleSaveEdit = async () => {
    if (!accessToken) {
      alert("No access token found.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/course/edit/?course_id=${editingCourse._id}`,
        editingCourse,
        {
          headers: {
            "access_token": accessToken,
          },
        }
      );

      if (response.data.responseCode === 200) {
        alert("Course updated successfully!");
        fetchCourses();
        handleCancelEdit();
      } else {
        alert(`Failed to update course: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/course/delete?course_id=${courseId}`, {
        headers: {
          "access_token": accessToken,
        },
      });

      if (response.data.responseCode === 200) {
        alert("Course deleted successfully!");
        fetchCourses();
      } else {
        alert(`Failed to delete course: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const handleSearch = (value, isEdit = false) => {
    const searchValue = value.trim().toLowerCase();
    if (searchValue) {
      const filtered = faculties.filter(faculty => 
        faculty.name.toLowerCase().includes(searchValue)
      );
      setFilteredFaculties(filtered);
      setIsSearchClicked(true);
    } else {
      setFilteredFaculties([]);
      setIsSearchClicked(false);
    }
  };

  const selectFaculty = (faculty, isEdit = false) => {
    if (isEdit) {
      setEditingCourse({
        ...editingCourse,
        facultyId: faculty._id,
        faculty_name: faculty.name
      });
      setEditSearchTerm(faculty.name);
    } else {
      setNewCourse({
        ...newCourse,
        facultyId: faculty._id,
        faculty_name: faculty.name
      });
      setSearchTerm(faculty.name);
    }
    setFilteredFaculties([]);
    setIsSearchClicked(false);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditSearchTerm("");
    setCurrentCourseId(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-6 w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Manage Courses
        </h1>
        
        {/* Search Bar */}
        <div className="mb-4 w-full flex flex-row">
          <input
            type="text"
            placeholder="Search Course Title"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mr-2 w-full"
          />
        </div>

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
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search Faculty"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                onFocus={() => setIsSearchClicked(true)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
              />
              {isSearchClicked && filteredFaculties.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto z-10">
                  {filteredFaculties.map((faculty) => (
                    <li
                      key={faculty._id}
                      onClick={() => selectFaculty(faculty, false)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {faculty.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
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
            <table className="w-full bg-white border border-gray-200 rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Faculty Name</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const faculty = faculties.find(f => f._id === course.facultyId);
                    return (
                      <tr key={course._id} className="text-sm text-gray-600 hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{course.title}</td>
                        <td className="px-4 py-2 border-b">{course.description}</td>
                        <td className="px-4 py-2 border-b">{faculty ? faculty.name : course.faculty_name || "N/A"}</td>
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
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No courses found</td>
                  </tr>
                )}
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
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
              />
              <input
                type="text"
                placeholder="Description"
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
              />
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search Faculty"
                  value={editSearchTerm}
                  onChange={(e) => {
                    setEditSearchTerm(e.target.value);
                    handleSearch(e.target.value, true);
                  }}
                  onFocus={() => setIsSearchClicked(true)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                />
                {isSearchClicked && filteredFaculties.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto z-10">
                    {filteredFaculties.map((faculty) => (
                      <li
                        key={faculty._id}
                        onClick={() => selectFaculty(faculty, true)}
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