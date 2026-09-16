import { useEffect, useState } from 'react';
import api from '../api/axios';

function StudentResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/results/my')
      .then((res) => setResults(res.data))
      .catch(() => setError('Failed to load results'));
  }, []);

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Results</h1>

      <div className="grid gap-4 max-w-2xl">
        {results.length === 0 && <p className="text-gray-600">No published results yet.</p>}

        {results.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">{r.exam.title}</h2>
            <p className="text-sm text-gray-700">Marks: {r.marksObtained} / {r.maxMarks}</p>
            <p className="text-sm text-gray-700">Grade: {r.grade}</p>
            <p className={`text-sm font-semibold ${r.passStatus === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
              {r.passStatus.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentResults;