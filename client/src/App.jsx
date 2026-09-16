import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CreateExam from './pages/CreateExam';
import ExamList from './pages/ExamList';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDuties from './pages/FacultyDuties';
import AttendanceMarking from './pages/AttendanceMarking';
import MarksEntry from './pages/MarksEntry';
import StudentResults from './pages/StudentResults';
import Notifications from './pages/Notifications';
import ManageAdmins from './pages/ManageAdmins';
import AuditLogs from './pages/AuditLogs';
import SystemSettings from './pages/SystemSettings';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        <Route path="/exams" element={<ProtectedRoute allowedRoles={['student']}><ExamList /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute allowedRoles={['student']}><StudentResults /></ProtectedRoute>} />

        <Route path="/faculty/duties" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDuties /></ProtectedRoute>} />
        <Route path="/faculty/attendance" element={<ProtectedRoute allowedRoles={['faculty']}><AttendanceMarking /></ProtectedRoute>} />
        <Route path="/faculty/marks-entry" element={<ProtectedRoute allowedRoles={['faculty']}><MarksEntry /></ProtectedRoute>} />

        <Route path="/admin/create-exam" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><CreateExam /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminDashboard /></ProtectedRoute>} />

        <Route path="/superadmin/admins" element={<ProtectedRoute allowedRoles={['superadmin']}><ManageAdmins /></ProtectedRoute>} />
        <Route path="/superadmin/audit-logs" element={<ProtectedRoute allowedRoles={['superadmin']}><AuditLogs /></ProtectedRoute>} />
        <Route path="/superadmin/settings" element={<ProtectedRoute allowedRoles={['superadmin']}><SystemSettings /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;