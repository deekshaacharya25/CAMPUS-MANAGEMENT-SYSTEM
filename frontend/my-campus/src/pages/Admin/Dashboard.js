import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import campus from '../../assets/campus.jpg'; // Example image

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard" image={campus}>
      <p>Welcome, Admin! Manage users, courses, and events from here.</p>
    </DashboardLayout>
  );
};

export default AdminDashboard;
