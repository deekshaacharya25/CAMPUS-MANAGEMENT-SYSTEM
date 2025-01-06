import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import campus from '../../assets/campus.jpg'; 
import Navbar from '../../components/Navbar';

const StudentDashboard = () => {
  return (
    <>
    <Navbar navbarTitle="Welcome Student!" />
    
    <DashboardLayout title="Student Dashboard" image={campus}>
      <p>Simplifying Campus Life, Enhancing Every Interaction.</p>
    </DashboardLayout>
  </>
  );
};

export default StudentDashboard;
