import { useState } from 'react';
import api from '../api/axios';

function AttendanceMarking() {
  const [examId, setExamId] = useState('');
  const [centerId, setCenterId] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchStudents = async () => {
    setError('');
    setMessage('');
    try {
      const res = await api.get('/duties/attendance-list', {
        params: { examId, centerId },
      });
      setStudents(res.data);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  const handleMark = async (applicationId, status) => {
    try {
      await api.post('/duties/mark-attendance', { applicationId, attendanceStatus: status });
      setStudents((prev) =>
        prev.map((s) =>
          s._id === applicationId ? { ...s, attendanceStatus: status } : s
        )
      );
      setMessage('Attendance updated');
    } catch (err) {
      setError('Failed to update attendance');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h1>

      <div className="bg-white p-4 rounded-lg shadow-md max-w-xl mb-6">
        <input
          placeholder="Exam ID"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          placeholder="Center ID"
          value={centerId}
          onChange={(e) => setCenterId(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <button
          onClick={fetchStudents}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load Students
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="grid gap-3 max-w-2xl">
        {students.map((s) => (
          <div key={s._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{s.student.name}</p>
              <p className="text-sm text-gray-600">Seat: {s.seatNumber}</p>
              <p className="text-sm text-gray-600">Status: {s.attendanceStatus}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleMark(s._id, 'present')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Present</button>
              <button onClick={() => handleMark(s._id, 'absent')} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">Absent</button>
              <button onClick={() => handleMark(s._id, 'ufm')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">UFM</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceMarking;