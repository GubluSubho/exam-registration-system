import { useEffect, useState } from 'react';
import api from '../api/axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  const fetchNotifications = () => {
    api.get('/notifications/my')
      .then((res) => setNotifications(res.data))
      .catch(() => setError('Failed to load notifications'));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      // silent fail is fine here
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>

      <div className="grid gap-3 max-w-2xl">
        {notifications.length === 0 && <p className="text-gray-600">No notifications yet.</p>}

        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.isRead && handleMarkRead(n._id)}
            className={`p-4 rounded-lg shadow-md cursor-pointer ${n.isRead ? 'bg-white' : 'bg-blue-50 border border-blue-300'}`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800">{n.title}</h3>
              {!n.isRead && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">New</span>}
            </div>
            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;