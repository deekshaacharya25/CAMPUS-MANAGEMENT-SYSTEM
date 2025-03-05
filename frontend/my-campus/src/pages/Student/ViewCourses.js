import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const ViewCourses = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDepartmentId, setUserDepartmentId] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserDepartmentId(decoded.departmentId);
    }
  }, []);

  useEffect(() => {
    if (userDepartmentId) {
      fetchDepartmentAndCourses();
    }
  }, [userDepartmentId]);

  const fetchDepartmentAndCourses = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:3000/api/department/list/?department_id=${userDepartmentId}`, {
        headers: { access_token: accessToken },
      });

      if (response.data.responseCode === 200) {
        const departmentArray = response.data.responseData;
        if (departmentArray.length > 0) {
          const department = departmentArray[0];
          if (department.courses && department.courses.length > 0) {
            const courses = await fetchCourses(department.courses);
            department.courses = courses;
            setDepartments([department]);
          } else {
            setDepartments([{ ...department, courses: [] }]);
          }
        } else {
          setDepartments([]);
        }
      } else {
        throw new Error('Failed to fetch department data');
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchCourses = async (courseIds) => {
    if (!courseIds?.length) {
      return [];
    }
    try {
      const accessToken = localStorage.getItem('access_token');
      const courseDetails = [];
      for (const courseId of courseIds) {
        const response = await axios.get(`http://localhost:3000/api/course/list/?course_id=${courseId}`, {
          headers: { access_token: accessToken },
        });
        const course = response.data.responseData[0];

        const materialsResponse = await axios.get(`http://localhost:3000/api/course/materials?course_id=${courseId}`, {
          headers: { access_token: accessToken },
        });
        course.materials = materialsResponse.data.responseData.materials;

        courseDetails.push(course);
      }
      return courseDetails;
    } catch (error) {
      return [];
    }
  };

  const handleDownload = async (material) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:3000/api/course/materials/${material._id}`, {
        headers: { access_token: accessToken },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: material.file_type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = material.title + material.file_type;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download the file');
    }
  };

  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get("v");
      if (!videoId && urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      }
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-800">My Courses</h1>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="space-y-4">
            {departments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No courses found.</p>
            ) : (
              departments[0].courses.map((course) => (
                <div key={course._id} className="border border-yellow-100 rounded-lg p-4 hover:bg-yellow-50 transition-colors">
                  <div className="space-y-4">
                    <div className="border-l-4 border-yellow-200 pl-4">
                      <h4 className="text-3xl font-semibold text-yellow-800 mb-2 text-left">{course.title}</h4>
                      <p className="text-sm text-gray-500 mb-2 text-left">
                        {course.description?.length > 150 && expandedCourse !== course._id
                          ? `${course.description.substring(0, 150)}...`
                          : course.description}
                      </p>
                      {course.description?.length > 150 && (
                        <button
                          onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
                          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium mb-2"
                        >
                          {expandedCourse === course._id ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-yellow-800 mb-2 text-left">Course Materials</h5>
                        {course.materials?.length > 0 ? (
                          <ul className="space-y-2">
                            {course.materials.map((material) => (
                              <li key={material._id} className="text-sm text-left">
                                {material.file_type === "video" ? (
                                  <>
                                    🎥{" "}
                                    <div className="my-4">
                                      <iframe
                                        width="560"
                                        height="315"
                                        src={getEmbedUrl(material.file_url)}
                                        title="YouTube video"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    </div>
                                    - Uploaded on {new Date(material.createdAt).toLocaleDateString()}
                                  </>
                                ) : (
                                  <>
                                    📄 <strong>{material.title}</strong> - Uploaded on{" "}
                                    {new Date(material.createdAt).toLocaleDateString()}
                                    <button
                                      onClick={() => handleDownload(material)}
                                      className="text-yellow-600 hover:text-yellow-700 font-medium ml-2"
                                    >
                                      Download
                                    </button>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 text-left">No materials available yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourses;