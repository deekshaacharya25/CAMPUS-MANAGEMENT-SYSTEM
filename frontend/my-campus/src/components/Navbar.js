import React from 'react';
import { FaBuildingColumns } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function Navbar({ navbarTitle = 'Offcanvas navbar', role }) {
  const getDashboardLink = () => {
    switch (role) {
      case 1:
        return "/admin/dashboard";
      case 2:
        return "/faculty/dashboard";
      case 3:
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  return (
    <div>
      <nav className="navbar bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand d-flex text-heather" href="#">
            <FaBuildingColumns className='text-heather text-3xl me-3' />
            <span className="text-bluegrey">{navbarTitle}</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">{navbarTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Manage Dashboard
                  </a>
                  <ul className="dropdown-menu">
                    {role === 1 && (
                      <>
                        <li><a className="dropdown-item" href="/admin/manage-users">Manage Users</a></li>
                        <li><a className="dropdown-item" href="/admin/manage-courses">Manage Courses</a></li>
                        <li><a className="dropdown-item" href="/admin/manage-departments">Manage Departments</a></li>
                        <li><a className="dropdown-item" href="/admin/manage-events">Manage Events</a></li>
                      </>
                    )}
                    {role === 2 && (
                      <>
                        <li><a className="dropdown-item" href="/faculty/my-profile">My Profile</a></li>
                        <li><a className="dropdown-item" href="/faculty/assigned-courses">Assigned Courses</a></li>
                        <li><a className="dropdown-item" href="/faculty/manage-events">Manage Events</a></li>
                        <li><a className="dropdown-item" href="/faculty/direct-message">Message</a></li>
                        <li><a className="dropdown-item" href="/faculty/forum-posts">Forum Posts</a></li>
                        <li><a className="dropdown-item" href="/faculty/send-announcements">Send Announcements</a></li>
                      </>
                    )}
                    {role === 3 && (
                      <>
                        <li><a className="dropdown-item" href="/student/my-profile">My Profile</a></li>
                        <li><a className="dropdown-item" href="/student/view-courses">Courses</a></li>
                        <li><a className="dropdown-item" href="/student/academic-calendar">Academic Calendar</a></li>
                        <li><a className="dropdown-item" href="/student/direct-message">Message</a></li>
                        <li><a className="dropdown-item" href="/student/forum-posts">Forum Posts</a></li>
                        <li><a className="dropdown-item" href="/student/view-announcements">Announcements</a></li>
                      </>
                    )}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;