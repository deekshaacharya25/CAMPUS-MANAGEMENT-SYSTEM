//import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.js';
import LoginPage from './pages/LoginPage.js'
import Navbar from './components/Navbar';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageEvents from './pages/Admin/ManageEvents';
import FacultyDashboard from './pages/Faculty/Dashboard';

import DashboardLayout from './components/DashboardLayout.js';
import FacultyProfile from './pages/Faculty/Profile.js';
import StudentProfile from './pages/Student/Profile.js';
import AssignedCourses from './pages/Faculty/AssignedCourses.js';
import UploadMaterials from './pages/Faculty/UploadMaterials.js';
import SendAnnouncements from './pages/Faculty/SendAnnouncements.js';
import StudentInteraction from './pages/Faculty/StudentInteraction.js';
import Department from './pages/Faculty/Department.js';
import StudentDashboard from './pages/Student/Dashboard';
import CourseMaterials from './pages/Student/CourseMaterials';
import AcademicCalendar from './pages/Student/AcademicCalendar';
import DirectMessage from './pages/Student/DirectMessage.js';
import ViewCourses from './pages/Student/ViewCourses.js';
import ViewAnnouncements from './pages/Student/ViewAnnouncements.js';
import ResetPassword from './pages/ResetPassword.js';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>}></Route>
          <Route path="/register" element={<RegisterPage/>}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-courses" element={<ManageCourses />} />
          <Route path="/admin/manage-events" element={<ManageEvents />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/faculty/my-profile" element={<FacultyProfile />} />
          <Route path="/faculty/assigned-courses" element={<AssignedCourses />} />
          <Route path="/faculty/department" element={<Department />} />
           <Route path="/faculty/upload-materials" element={<UploadMaterials />} />
           <Route path="/faculty/send-announcements" element={<SendAnnouncements />} />
           <Route path="/faculty/student-interaction" element={<StudentInteraction/>} />
           <Route path="/student/dashboard" element={<StudentDashboard />} />
           <Route path="/student/my-profile" element={<StudentProfile />} />
           <Route path="/student/view-courses" element={<ViewCourses />} />
           <Route path="/student/course-materials" element={<CourseMaterials />} />
           <Route path="/student/academic-calendar" element={<AcademicCalendar />} />
           <Route path="/student/direct-message" element={<DirectMessage/>} />
           <Route path="/student/view-announcements" element={<ViewAnnouncements />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;