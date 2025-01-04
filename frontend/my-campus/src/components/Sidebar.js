import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
