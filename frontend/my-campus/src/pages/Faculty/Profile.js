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
    <div className="profile-page bg-white p-6 rounded shadow-md flex flex-row items-start gap-8">
      {/* Left Section: Profile Photo */}
      <div className="w-1/3 flex justify-center items-center">
        <img
          src={faculty.image || "https://via.placeholder.com/150"}
          alt="Faculty Avatar"
          className="rounded-full w-48 h-48 object-cover border border-gray-300"
        />
      </div>

      {/* Right Section: Profile Details */}
      <div className="w-2/3">
        <h1 className="text-3xl font-bold mb-4">Faculty Profile</h1>
        <p className="text-lg"><strong>Name:</strong> {faculty.name}</p>
        <p className="text-lg"><strong>Email:</strong> {faculty.email}</p>
        <p className="text-lg"><strong>Department:</strong> {faculty.department}</p>
        <p className="text-lg"><strong>Designation:</strong> {faculty.designation}</p>
        <p className="text-lg"><strong>Courses Taught:</strong> {faculty.courses.join(", ")}</p>
      </div>
    </div>
  );
};

export default FacultyProfile;
