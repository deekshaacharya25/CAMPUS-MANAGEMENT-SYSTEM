import React, { useState, useEffect } from "react";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Fetch student profile from the database or API
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/student/profile");
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
    <div className="profile-page bg-white p-6 rounded shadow-md flex flex-row items-start gap-8">
      {/* Left Section: Profile Photo */}
      <div className="w-1/3 flex justify-center items-center">
        <img
          src={student.image || "https://via.placeholder.com/150"}
          alt="Student Avatar"
          className="rounded-full w-48 h-48 object-cover border border-gray-300"
        />
      </div>

      {/* Right Section: Profile Details */}
      <div className="w-2/3">
        <h1 className="text-3xl font-bold mb-4">Student Profile</h1>
        <p className="text-lg"><strong>Name:</strong> {student.name}</p>
        <p className="text-lg"><strong>Roll Number:</strong> {student.rollno}</p>
        <p className="text-lg"><strong>Email:</strong> {student.email}</p>
        <p className="text-lg"><strong>Department:</strong> {student.department}</p>
        <p className="text-lg"><strong>Courses Enrolled:</strong> {student.courses.join(", ")}</p>
      </div>
    </div>
  );
};

export default StudentProfile;
