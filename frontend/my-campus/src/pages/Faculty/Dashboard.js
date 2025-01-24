import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import campus from '../../assets/campus.jpg'; 
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'; 
import image1 from '../../assets/image1.jpg'; 
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.jpg';

const FacultyDashboard = () => {
  const role = 2;

  return (
    <>
      <Navbar navbarTitle="Welcome Faculty!" role={role} />
  
      <DashboardLayout title="Faculty Dashboard" image={campus} id="dashboard">
        <p>Simplifying Campus Life, Enhancing Every Interaction.</p>
      </DashboardLayout>

      {/* New Section: About Campus */}
      <section id="about-campus" className="about-campus py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">About Campus</h2>
          <p className="text-center text-gray-600 mb-12">
            Our campus is dedicated to providing a vibrant and inclusive environment for all students. 
            We offer a range of facilities and services to support academic success and personal growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Library Section */}
            <div className="rounded-lg shadow-lg overflow-hidden group">
              <img
                src={image1}
                alt="Library"
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Modern Library</h3>
                <p className="text-gray-600">Our state-of-the-art library offers a vast collection of books, journals, and digital resources.</p>
              </div>
            </div>

            {/* Sports Section */}
            <div className="rounded-lg shadow-lg overflow-hidden group">
              <img
                src={image3}
                alt="Sports Facilities"
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sports Facilities</h3>
                <p className="text-gray-600">From indoor courts to outdoor fields, we encourage an active and healthy lifestyle.</p>
              </div>
            </div>

            {/* Hostel Section */}
            <div className="rounded-lg shadow-lg overflow-hidden group">
              <img
                src={image2}
                alt="Hostel"
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Comfortable Hostels</h3>
                <p className="text-gray-600">Our hostels are designed to provide a safe and comfortable living experience for students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </>
  );
};

export default FacultyDashboard;
