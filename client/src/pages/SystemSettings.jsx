import { useEffect, useState } from 'react';
import api from '../api/axios';

function SystemSettings() {
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/settings')
      .then((res) => setFormData(res.data))
      .catch(() => setError('Failed to load settings'));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.put('/settings', formData);
      setMessage('Settings updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    }
  };

  if (!formData) return <p className="p-6">Loading settings...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">System Settings</h2>

        {message && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</p>}

        <label className="block text-sm text-gray-600 mb-1">Institution Name</label>
        <input name="institutionName" value={formData.institutionName} onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" />

        <label className="block text-sm text-gray-600 mb-1">Support Email</label>
        <input name="supportEmail" value={formData.supportEmail} onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" />

        <label className="block text-sm text-gray-600 mb-1">Late Fee Amount (₹)</label>
        <input type="number" name="lateFeeAmount" value={formData.lateFeeAmount} onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" />

        <label className="block text-sm text-gray-600 mb-1">Re-evaluation Fee (₹)</label>
        <input type="number" name="reEvaluationFee" value={formData.reEvaluationFee} onChange={handleChange} className="w-full mb-4 px-3 py-2 border rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default SystemSettings;