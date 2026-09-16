import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page Not Found</p>
      <Link
        to="/dashboard"
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;