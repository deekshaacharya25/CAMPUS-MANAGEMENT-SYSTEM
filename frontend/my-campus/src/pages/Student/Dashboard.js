import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import campus from '../../assets/campus.jpg'; 

const StudentDashboard = () => {
  return (
    <DashboardLayout title="Student Dashboard" image={campus}>
      <p>Welcome, Student! Access course materials and stay updated on events.</p>
    </DashboardLayout>
  );
};

export default StudentDashboard;
