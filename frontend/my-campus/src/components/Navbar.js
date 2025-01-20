import React from 'react';
import { FaBuildingColumns } from "react-icons/fa6";

function Navbar({ navbarTitle = 'Offcanvas navbar', role }) {
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
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Manage Dashboard
                  </a>
                  <ul className="dropdown-menu">
                    {role === 1 && (
                      <>
                        <li><a className="dropdown-item" href="#">Manage Users</a></li>
                        <li><a className="dropdown-item" href="#">Manage Courses</a></li>
                        <li><a className="dropdown-item" href="#">Manage Events</a></li>
                      </>
                    )}
                    {role === 2 && (
                      <>
                        <li><a className="dropdown-item" href="#">View Courses</a></li>
                        <li><a className="dropdown-item" href="#">Manage Assignments</a></li>
                      </>
                    )}
                    {role === 3 && (
                      <>
                        <li><a className="dropdown-item" href="#">View Courses</a></li>
                        <li><a className="dropdown-item" href="#">Submit Assignments</a></li>
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
