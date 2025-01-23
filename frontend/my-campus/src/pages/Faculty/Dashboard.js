import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import campus from '../../assets/campus.jpg'; 
import Navbar from '../../components/Navbar';

const FacultyDashboard = () => {
  const role = 2;
  return (
    <>
    <Navbar navbarTitle="Welcome Faculty!" />
  
    <DashboardLayout title="Faculty Dashboard" image={campus}>
      <p>Simplifying Campus Life, Enhancing Every Interaction.</p>
    </DashboardLayout>
  </>
  );
};

export default FacultyDashboard;
