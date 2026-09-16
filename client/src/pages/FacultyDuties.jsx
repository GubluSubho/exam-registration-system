import { useEffect, useState } from 'react';
import api from '../api/axios';

function FacultyDuties() {
  const [duties, setDuties] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/duties/my')
      .then((res) => setDuties(res.data))
      .catch(() => setError('Failed to load duties'));
  }, []);

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Invigilation Duties</h1>

      <div className="grid gap-4 max-w-2xl">
        {duties.length === 0 && <p className="text-gray-600">No duties assigned yet.</p>}

        {duties.map((duty) => (
          <div key={duty._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">{duty.exam.title}</h2>
            <p className="text-sm text-gray-700">Center: {duty.center.name}</p>
            <p className="text-sm text-gray-700">Room: {duty.roomNumber}</p>
            <p className="text-sm text-gray-700">
              Date: {new Date(duty.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultyDuties;
