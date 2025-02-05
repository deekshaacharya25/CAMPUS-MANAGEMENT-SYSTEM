import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    courses: [],
  });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
  const [Courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const accessToken = localStorage.getItem("access_token");

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/department/list", {
        headers: {
          "access_token": accessToken,
        },
      });
      if (response.data.responseCode === 200) {
        setDepartments(response.data.responseData);
      } else {
        console.error("Failed to fetch departments:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/course/list", {
        headers: {
          "access_token": accessToken,
        },
      });
      if (response.data.responseCode === 200) {
        setCourses(response.data.responseData);
        setFilteredCourses(response.data.responseData);
      } else {
        console.error("Failed to fetch Courses:", response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching Courses:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchDepartments();
      fetchCourses();
    }
  }, [accessToken]);

  const filteredDepartments = departments.filter(department => {
    return department.name.toLowerCase().includes(searchKey.toLowerCase());
  });

  const handleAddDepartment = async () => {
    if (!accessToken) {
      alert("No access token found.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/department/add", newDepartment, {
        headers: {
          "access_token": accessToken,
        },
      });

      if (response.data.responseCode === 200) {
        alert("Department added successfully!");
        fetchDepartments();
        setNewDepartment({ name: "", description: "", courses: [] });
        setSearchTerm("");
      } else {
        alert(`Failed to add department: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Failed to add department. Please check your permissions.");
    }
  };

  const handleEditDepartment = (department) => {
    setCurrentDepartmentId(department._id);
    setEditingDepartment(department);
    setEditSearchTerm(department.name || '');
  };

  const handleSaveEdit = async () => {
    if (!accessToken) {
      alert("No access token found.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/Department/edit/?department_id=${editingDepartment._id}`,
        editingDepartment,
        {
          headers: {
            "access_token": accessToken,
          },
        }
      );

      if (response.data.responseCode === 200) {
        alert("Department updated successfully!");
        fetchDepartments();
        handleCancelEdit();
      } else {
        alert(`Failed to update department: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Failed to update department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/department/delete?department_id=${departmentId}`, {
        headers: {
          "access_token": accessToken,
        },
      });

      if (response.data.responseCode === 200) {
        alert("Department deleted successfully!");
        fetchDepartments();
      } else {
        alert(`Failed to delete department: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department. Please try again.");
    }
  };

  const handleSearch = (value, isEdit = false) => {
    const searchValue = value.trim().toLowerCase();
    if (searchValue) {
      const filtered = Courses.filter(course => 
        course.title && course.title.toLowerCase().includes(searchValue)
      );
      setFilteredCourses(filtered);
      setIsSearchClicked(true);
    } else {
      setFilteredCourses([]);
      setIsSearchClicked(false);
    }
  };

  const selectcourse = (course, isEdit = false) => {
    if (isEdit) {
      const updatedCourses = editingDepartment.courses.includes(course._id)
        ? editingDepartment.courses.filter(id => id !== course._id)
        : [...editingDepartment.courses, course._id];
      setEditingDepartment({
        ...editingDepartment,
        courses: updatedCourses,
      });
      setEditSearchTerm('');
    } else {
      const updatedCourses = newDepartment.courses.includes(course._id)
        ? newDepartment.courses.filter(id => id !== course._id)
        : [...newDepartment.courses, course._id];
      setNewDepartment({
        ...newDepartment,
        courses: updatedCourses,
      });
      setSearchTerm('');
    }
    setFilteredCourses([]);
    setIsSearchClicked(false);
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setEditSearchTerm("");
    setCurrentDepartmentId(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-6 w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          Manage departments
        </h1>
        
        {/* Search Bar */}
        <div className="mb-4 w-full flex flex-row">
          <input
            type="text"
            placeholder="Search Department Title"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mr-2 w-full"
          />
        </div>

        {/* Add Department Form */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Department
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Department Title"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
            <input
              type="text"
              placeholder="Description"
              value={newDepartment.description}
              onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
            />
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search course"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                onFocus={() => setIsSearchClicked(true)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
              />
              {isSearchClicked && filteredCourses.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto z-10">
                  {filteredCourses.map((course) => (
                    <li
                      key={course._id}
                      onClick={() => selectcourse(course, false)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {course.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              {newDepartment.courses.map(courseId => {
                const course = Courses.find(c => c._id === courseId);
                return course ? (
                  <span key={courseId} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {course.title}
                  </span>
                ) : null;
              })}
            </div>
            <button
              onClick={handleAddDepartment}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Department
            </button>
          </div>
        </section>

        {/* departments Table */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            All departments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">course Name</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => {
                    const courseTitles = department.courses.map(courseId => {
                      const course = Courses.find(c => c._id === courseId);
                      return course ? course.title : "N/A";
                    }).join(", ");
                    return (
                      <tr key={department._id} className="text-sm text-gray-600 hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{department.name}</td>
                        <td className="px-4 py-2 border-b">{department.description}</td>
                        <td className="px-4 py-2 border-b">{courseTitles}</td>
                        <td className="px-4 py-2 border-b">
                          <button
                            onClick={() => handleEditDepartment(department)}
                            className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(department._id)}
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
                    <td colSpan="4" className="text-center">No departments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edit Department Form */}
        {editingDepartment && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Edit Department
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Department Title"
                value={editingDepartment.name}
                onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
              />
              <input
                type="text"
                placeholder="Description"
                value={editingDepartment.description}
                onChange={(e) => setEditingDepartment({ ...editingDepartment, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
              />
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search course"
                  value={editSearchTerm}
                  onChange={(e) => {
                    setEditSearchTerm(e.target.value);
                    handleSearch(e.target.value, true);
                  }}
                  onFocus={() => setIsSearchClicked(true)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                />
                {isSearchClicked && filteredCourses.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-48 overflow-y-auto z-10">
                    {filteredCourses.map((course) => (
                      <li
                        key={course._id}
                        onClick={() => selectcourse(course, true)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {course.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                {editingDepartment.courses.map(courseId => {
                  const course = Courses.find(c => c._id === courseId);
                  return course ? (
                    <span key={courseId} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {course.title}
                    </span>
                  ) : null;
                })}
              </div>
              <div>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                >
                  Update Department
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

export default ManageDepartments;