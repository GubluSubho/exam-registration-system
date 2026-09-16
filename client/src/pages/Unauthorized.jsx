import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-lg text-gray-600 mb-6">Access Denied — you don't have permission to view this page.</p>
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default Unauthorized;