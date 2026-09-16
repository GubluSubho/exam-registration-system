import { useEffect, useState } from 'react';
import api from '../api/axios';

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAdmins = () => {
    api.get('/superadmin/admins')
      .then((res) => setAdmins(res.data))
      .catch(() => setError('Failed to load admins'));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/superadmin/admins', formData);
      setMessage('Admin created successfully');
      setFormData({ name: '', email: '', password: '' });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await api.put(`/superadmin/admins/${id}/deactivate`);
      fetchAdmins();
    } catch (err) {
      setError('Failed to deactivate admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Admins</h1>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-md max-w-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Create New Admin</h2>
        {message && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-3">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">{error}</p>}
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full mb-3 px-3 py-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full mb-3 px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full mb-4 px-3 py-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Admin</button>
      </form>

      <div className="grid gap-3 max-w-2xl">
        {admins.map((a) => (
          <div key={a._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{a.name} ({a.role})</p>
              <p className="text-sm text-gray-600">{a.email}</p>
              <p className="text-xs text-gray-500">{a.isVerified ? 'Active' : 'Deactivated'}</p>
            </div>
            <button onClick={() => handleDeactivate(a._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
              Deactivate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageAdmins;