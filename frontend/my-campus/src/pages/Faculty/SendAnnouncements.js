import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SendAnnouncements() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState('ALL');
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [studentIds, setStudentIds] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchDepartments = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:3000/api/department/list', {
        headers: { 'access_token': accessToken },
      });
      setDepartments(response.data.responseData);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:3000/api/course/list', {
        headers: { 'access_token': accessToken },
      });
      setCourses(response.data.responseData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:3000/api/user/list/students', {
        headers: { 'access_token': accessToken },
      });
      setStudents(response.data.responseData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await axios.post('http://localhost:3000/api/message/announcement/create', {
        title,
        content,
        recipients,
        department_id: recipients === 'DEPARTMENT' ? departmentId : undefined,
        course_id: recipients === 'COURSE' ? courseId : undefined,
        student_ids: recipients === 'SPECIFIC' ? studentIds : undefined,
      }, {
        headers: { 'access_token': accessToken },
      });

      if (response.data.responseCode === 200) {
        setSuccessMessage('Announcement sent successfully!');
        setTitle('');
        setContent('');
        setRecipients('ALL');
        setDepartmentId('');
        setCourseId('');
        setStudentIds([]);
      } else {
        setErrorMessage('Failed to send announcement.');
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
      setErrorMessage('Failed to send announcement.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-yellow-800 mb-4">Send Announcement</h1>
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSendAnnouncement}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="6"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="recipients">
              Recipients
            </label>
            <select
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="ALL">All</option>
              <option value="DEPARTMENT">Department</option>
              <option value="COURSE">Course</option>
              <option value="SPECIFIC">Specific Students</option>
            </select>
          </div>
          {recipients === 'DEPARTMENT' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="departmentId">
                Department
              </label>
              <select
                id="departmentId"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department._id} value={department._id}>{department.name}</option>
                ))}
              </select>
            </div>
          )}
          {recipients === 'COURSE' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="courseId">
                Course
              </label>
              <select
                id="courseId"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>
          )}
          {recipients === 'SPECIFIC' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="studentIds">
                Students
              </label>
              <select
                id="studentIds"
                multiple
                value={studentIds}
                onChange={(e) => setStudentIds(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {students.map(student => (
                  <option key={student._id} value={student._id}>{student.name}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendAnnouncements;


