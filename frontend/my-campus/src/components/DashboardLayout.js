import React from 'react';

const DashboardLayout = ({ children, image }) => {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      
      
      {/* Main Content */}
      <div className="flex flex-row items-center min-h-screen">
        {/* Left Section: Text */}
        <div className="w-3/5 p-10">
          <h1 className="text-7xl font-extrabold text-left text-gray-800 leading-tight raleway-font">
            CAMPUS <br />
            <span className="text-yellow-600">MANAGEMENT</span> <br />
            SYSTEM
          </h1>
          <div className="mt-8 text-2xl text-gray-600">
            {children}
          </div>
        </div>
        
        {/* Right Section: Image */}
        <div className="w-3/5 p-5 flex justify-center items-center">
          <img
            src={image}
            alt="Dashboard Visual"
            className=" object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
