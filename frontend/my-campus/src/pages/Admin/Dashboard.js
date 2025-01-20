import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import campus from '../../assets/campus.jpg'; 
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  return (
    <>
    <Navbar navbarTitle="Welcome Admin!" />
  
    <DashboardLayout title="Admin Dashboard" image={campus}>
      <p>Simplifying Campus Life, Enhancing Every Interaction.</p>
    </DashboardLayout>
  </>
  );
};

export default AdminDashboard;
