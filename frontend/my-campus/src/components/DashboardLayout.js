import React from 'react';

const DashboardLayout = ({ title, children, image }) => {
  return (
<div className="flex flex-col bg-white min-h-screen">
  <div className="bg-blue-600 text-white p-5 text-left text-2xl font-bold">
    CAMPUS MANAGEMENT SYSTEM
  </div>
  <div className="flex justify-between items-center p-5">
    <div className="flex-1 p-5 text-gray-700 text-lg">
      {children}
    </div>
    <div className="w-2/5">
      <img src={image} alt="Dashboard Visual" className="rounded-lg" />
    </div>
  </div>
</div>

  );
};

export default DashboardLayout;
