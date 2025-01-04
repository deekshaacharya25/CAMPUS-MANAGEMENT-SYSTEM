import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
        <li><Link to="/faculty/dashboard">Faculty Dashboard</Link></li>
        <li><Link to="/student/dashboard">Student Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
