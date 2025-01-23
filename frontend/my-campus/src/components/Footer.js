import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'; // Import React Icons

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Campus Management System</h3>
            <p className="text-gray-400">
              Simplifying campus operations and enhancing student experiences through innovative solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className='text-center'>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Quick Links</h3>
            <ul className="space-y-2 text-center mx-auto pr-8">
              <li>
                <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center"> {/* Center-align the section */}
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-gray-400">123 Campus Street, Education City</p>
            <p className="text-gray-400">Email: info@campusms.com</p>
            <p className="text-gray-400">Phone: +123 456 7890</p>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-4 mt-4"> 
              <a href="#" className="hover:text-white">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <FaLinkedinIn size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>&copy; 2025 Campus Management System. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
