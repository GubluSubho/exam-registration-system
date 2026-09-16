import { useEffect, useState } from 'react';
import api from '../api/axios';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handlePayment = async (applicationId) => {
    try {
      const { data } = await api.post('/applications/create-payment', { applicationId });

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Exam Registration System',
        description: 'Exam Fee Payment',
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await api.post('/applications/verify-payment', {
              applicationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            fetchApplications();
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        theme: { color: '#2563eb' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const handleDownloadHallTicket = async (applicationId) => {
    setDownloadingId(applicationId);
    setError('');
    try {
      const response = await api.get(`/applications/${applicationId}/hall-ticket`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hall-ticket-${applicationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download hall ticket');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <p className="p-6">Loading applications...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h1>

      {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 max-w-md">{error}</p>}

      <div className="grid gap-4 max-w-2xl">
        {applications.length === 0 && <p className="text-gray-600">No applications yet.</p>}

        {applications.map((app) => (
          <div key={app._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">{app.exam.title}</h2>
            <p className="text-sm text-gray-700">Status: {app.status}</p>
            <p className="text-sm text-gray-700 mb-3">
              Payment: {app.paymentStatus === 'paid' ? '✅ Paid' : '❌ Unpaid'}
            </p>

            {app.paymentStatus !== 'paid' && (
              <button
                onClick={() => handlePayment(app._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Pay Fee (₹{app.exam.fee})
              </button>
            )}

            {app.paymentStatus === 'paid' && app.status === 'approved' && (
              <button
                onClick={() => handleDownloadHallTicket(app._id)}
                disabled={downloadingId === app._id}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {downloadingId === app._id ? 'Downloading...' : 'Download Hall Ticket'}
              </button>
            )}

            {app.paymentStatus === 'paid' && app.status !== 'approved' && (
              <p className="text-sm text-yellow-600">Waiting for admin approval</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplications;