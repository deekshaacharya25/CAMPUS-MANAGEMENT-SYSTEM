//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.js';
import LoginPage from './pages/LoginPage.js'
import Navbar from './components/Navbar';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageEvents from './pages/Admin/ManageEvents';
import FacultyDashboard from './pages/Faculty/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import DashboardLayout from './components/DashboardLayout.js';
import FacultyProfile from './pages/Faculty/Profile.js';
import StudentProfile from './pages/Student/Profile.js';
function App() {
  return (
<div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage/>}></Route>
        <Route path="/loginpage" element={<LoginPage/>}></Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-courses" element={<ManageCourses />} />
        <Route path="/admin/manage-events" element={<ManageEvents />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
      </BrowserRouter>
      <AdminDashboard/>
      <StudentProfile/>
    </div>
  );
}

export default App;
