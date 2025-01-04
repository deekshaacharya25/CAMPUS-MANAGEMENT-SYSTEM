import React, { useState, useEffect } from "react";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Fetch student profile from the database or API
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/student/profile"); // Example API endpoint
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!student) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      <img
        src={student.image || "https://via.placeholder.com/150"}
        alt="Student Avatar"
        className="rounded-full w-32 h-32 mb-4"
      />
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Roll Number:</strong> {student.rollno}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Department:</strong> {student.department}</p>
      <p><strong>Courses Enrolled:</strong> {student.courses.join(", ")}</p>
    </div>
  );
};

export default StudentProfile;
