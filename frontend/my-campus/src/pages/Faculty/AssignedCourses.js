import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import UploadMaterials from './UploadMaterials'; // Import the UploadMaterials component

function AssignedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const accessToken = localStorage.getItem('access_token');
  const facultyId = accessToken ? jwtDecode(accessToken)?.id : null;

  useEffect(() => {
    if (facultyId) {
      fetchAssignedCourses();
    } else {
      console.error('Faculty ID not found');
      setLoading(false);
    }
  }, [facultyId]);

  const fetchAssignedCourses = async () => {
    try {
      console.log(`Fetching courses for facultyId: ${facultyId}`);
      const response = await axios.get(`http://localhost:3000/api/course/list/by-faculty?facultyId=${facultyId}`, {
        headers: { 'access_token': accessToken },
      });
      console.log('API Response:', response.data);
      if (Array.isArray(response.data.responseData)) {
        setCourses(response.data.responseData);
      } else {
        console.error('API response is not an array:', response.data);
        setCourses([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assigned courses:', error);
      setLoading(false);
    }
  };

  const openModal = (courseId) => {
    setSelectedCourse(courseId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4">Assigned Courses</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No assigned courses found.</p>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="border border-yellow-100 rounded-lg p-4 hover:bg-yellow-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.description}</p>
                  </div>
                  <button
                    onClick={() => openModal(course._id)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    Upload Course Materials
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
            <UploadMaterials courseId={selectedCourse} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignedCourses;