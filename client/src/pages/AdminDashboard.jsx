import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../api/axios';

const COLORS = ['#f59e0b', '#22c55e', '#ef4444'];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load analytics'));
  }, []);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  const pieData = stats.statusBreakdown.map((s) => ({ name: s._id, value: s.count }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
          <p className="text-sm text-gray-600">Students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-3xl font-bold text-green-600">{stats.totalExams}</p>
          <p className="text-sm text-gray-600">Exams</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
          <p className="text-sm text-gray-600">Applications</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-3xl font-bold text-orange-600">₹{stats.totalRevenue}</p>
          <p className="text-sm text-gray-600">Revenue</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Applications by Exam</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.examWiseApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="applications" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Application Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;