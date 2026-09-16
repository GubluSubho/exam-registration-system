import { useState } from 'react';
import api from '../api/axios';

function CreateExam() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    examDate: '',
    applicationStartDate: '',
    applicationEndDate: '',
    fee: 0,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/exams', formData);
      setMessage('Exam created successfully');
      setFormData({
        title: '', description: '', subject: '', examDate: '',
        applicationStartDate: '', applicationEndDate: '', fee: 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Exam</h2>

        {message && <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</p>}

        <input name="title" placeholder="Exam Title" value={formData.title} onChange={handleChange} required className="w-full mb-3 px-3 py-2 border rounded" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" />
        <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required className="w-full mb-3 px-3 py-2 border rounded" />

        <label className="block text-sm text-gray-600 mb-1">Application Start</label>
        <input type="date" name="applicationStartDate" value={formData.applicationStartDate} onChange={handleChange} required className="w-full mb-3 px-3 py-2 border rounded" />

        <label className="block text-sm text-gray-600 mb-1">Application End</label>
        <input type="date" name="applicationEndDate" value={formData.applicationEndDate} onChange={handleChange} required className="w-full mb-3 px-3 py-2 border rounded" />

        <label className="block text-sm text-gray-600 mb-1">Exam Date</label>
        <input type="date" name="examDate" value={formData.examDate} onChange={handleChange} required className="w-full mb-3 px-3 py-2 border rounded" />

        <input type="number" name="fee" placeholder="Fee (INR)" value={formData.fee} onChange={handleChange} className="w-full mb-4 px-3 py-2 border rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Exam
        </button>
      </form>
    </div>
  );
}

export default CreateExam;