import { useEffect, useState } from 'react';
import api from '../api/axios';

function ExamList() {
  const [exams, setExams] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      setExams(res.data);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setAppliedIds(res.data.map((app) => app.exam._id));
    } catch (err) {
      // silently ignore if user has no applications yet
    }
  };

  useEffect(() => {
    fetchExams();
    fetchMyApplications();
  }, []);

  const handleApply = async (examId) => {
    setError('');
    setMessage('');
    try {
      await api.post('/applications', { examId });
      setMessage('Applied successfully!');
      setAppliedIds([...appliedIds, examId]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <p className="p-6">Loading exams...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Exams</h1>

      {message && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 max-w-md">{message}</p>}
      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-md">{error}</p>}

      <div className="grid gap-4 max-w-2xl">
        {exams.length === 0 && <p className="text-gray-600">No exams available right now.</p>}

        {exams.map((exam) => (
          <div key={exam._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">{exam.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
            <p className="text-sm text-gray-700">Subject: {exam.subject}</p>
            <p className="text-sm text-gray-700">
              Exam Date: {new Date(exam.examDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 mb-3">Fee: ₹{exam.fee}</p>

            <button
              onClick={() => handleApply(exam._id)}
              disabled={appliedIds.includes(exam._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {appliedIds.includes(exam._id) ? 'Applied' : 'Apply'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamList;