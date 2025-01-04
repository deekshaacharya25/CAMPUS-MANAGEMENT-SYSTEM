import React, { useState, useEffect } from "react";

const FacultyProfile = () => {
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    // Fetch faculty profile from the database or API
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/faculty/profile"); // Example API endpoint
        const data = await response.json();
        setFaculty(data);
      } catch (error) {
        console.error("Error fetching faculty profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!faculty) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Faculty Profile</h1>
      <img
        src={faculty.image || "https://via.placeholder.com/150"}
        alt="Faculty Avatar"
        className="rounded-full w-32 h-32 mb-4"
      />
      <p><strong>Name:</strong> {faculty.name}</p>
      <p><strong>Email:</strong> {faculty.email}</p>
      <p><strong>Department:</strong> {faculty.department}</p>
      <p><strong>Designation:</strong> {faculty.designation}</p>
      <p><strong>Courses Taught:</strong> {faculty.courses.join(", ")}</p>
    </div>
  );
};

export default FacultyProfile;
