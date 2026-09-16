import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const linksByRole = {
    student: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/exams', label: 'Exams' },
      { to: '/my-applications', label: 'My Applications' },
      { to: '/results', label: 'Results' },
      { to: '/notifications', label: 'Notifications' },
    ],
    faculty: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/faculty/duties', label: 'Duty Roster' },
      { to: '/faculty/attendance', label: 'Attendance' },
      { to: '/faculty/marks-entry', label: 'Marks Entry' },
      { to: '/notifications', label: 'Notifications' },
    ],
    admin: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/admin/create-exam', label: 'Create Exam' },
      { to: '/admin/analytics', label: 'Analytics' },
      { to: '/notifications', label: 'Notifications' },
    ],
    superadmin: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/admin/analytics', label: 'Analytics' },
      { to: '/superadmin/admins', label: 'Manage Admins' },
      { to: '/superadmin/audit-logs', label: 'Audit Logs' },
      { to: '/superadmin/settings', label: 'Settings' },
    ],
  };

  const links = linksByRole[user.role] || [];

  if (!user.role) return null; // hide navbar on login/register pages

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex gap-5 items-center">
        <span className="font-bold text-gray-800">Exam System</span>
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-gray-600 hover:text-blue-600">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{user.name} ({user.role})</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;