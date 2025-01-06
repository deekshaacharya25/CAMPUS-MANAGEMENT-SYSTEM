import React, { useState, useEffect } from "react";
import axios from "axios";


const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    faculty_id: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Add a new course
  const addCourse = async () => {
    try {
      await axios.post("/api/courses", newCourse);
      setNewCourse({ title: "", description: "", faculty_id: "" });
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  // Edit a course
  const updateCourse = async () => {
    try {
      await axios.put(`/api/courses/${editingCourse._id}`, editingCourse);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  // Delete a course
  const deleteCourse = async (id) => {
    try {
      await axios.delete(`/api/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Fetch courses when the component loads
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="admin-page">
    
      <div className="admin-content">
        <h1>Manage Courses</h1>

        {/* Add New Course Form */}
        <div className="add-course-form">
          <h2>Add New Course</h2>
          <input
            type="text"
            placeholder="Course Title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Faculty ID"
            value={newCourse.faculty_id}
            onChange={(e) => setNewCourse({ ...newCourse, faculty_id: e.target.value })}
          />
          <button onClick={addCourse}>Add Course</button>
        </div>

        {/* Course List */}
        <h2>All Courses</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Faculty ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.faculty_id}</td>
                <td>
                  <button onClick={() => setEditingCourse(course)}>Edit</button>
                  <button onClick={() => deleteCourse(course._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Course Form */}
        {editingCourse && (
          <div className="edit-course-form">
            <h2>Edit Course</h2>
            <input
              type="text"
              placeholder="Course Title"
              value={editingCourse.title}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={editingCourse.description}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Faculty ID"
              value={editingCourse.faculty_id}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, faculty_id: e.target.value })
              }
            />
            <button onClick={updateCourse}>Update Course</button>
            <button onClick={() => setEditingCourse(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
