import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import campus from '../../assets/campus.jpg'; 

const FacultyDashboard = () => {
  return (
    <DashboardLayout title="Faculty Dashboard" image={campus}>
      <p>Welcome, Faculty! Upload materials and interact with students here.</p>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
