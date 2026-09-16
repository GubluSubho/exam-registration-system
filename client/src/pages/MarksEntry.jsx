import { useState } from 'react';
import api from '../api/axios';

function MarksEntry() {
  const [applicationId, setApplicationId] = useState('');
  const [marksObtained, setMarksObtained] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/results/enter-marks', {
        applicationId,
        marksObtained: Number(marksObtained),
        maxMarks: Number(maxMarks),
      });
      setMessage(`Marks saved. Grade: ${res.data.result.grade}, Status: ${res.data.result.passStatus}`);
      setApplicationId('');
      setMarksObtained('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enter marks');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Marks</h2>

        {message && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</p>}

        <label className="block text-sm text-gray-600 mb-1">Application ID</label>
        <input
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <label className="block text-sm text-gray-600 mb-1">Marks Obtained</label>
        <input
          type="number"
          value={marksObtained}
          onChange={(e) => setMarksObtained(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <label className="block text-sm text-gray-600 mb-1">Max Marks</label>
        <input
          type="number"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Marks
        </button>
      </form>
    </div>
  );
}

export default MarksEntry;