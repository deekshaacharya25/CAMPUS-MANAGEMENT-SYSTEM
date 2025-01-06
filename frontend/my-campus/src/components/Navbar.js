import React from 'react';
import { FaBuildingColumns } from "react-icons/fa6";

function Navbar({ navbarTitle = 'Offcanvas navbar' }) {
  return (
    <div>
<nav class="navbar bg-body-tertiary fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand d-flex  text-heather" href="#">
    <FaBuildingColumns className='text-heather text-3xl me-3 '/><span className="text-bluegrey">{navbarTitle}</span></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Admin Dashboard</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-start flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Manage Dashboard
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Manage Users</a></li>
              <li><a class="dropdown-item" href="#">Manage Courses</a></li>
              <li><a class="dropdown-item" href="#">Manage Events</a></li>
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
