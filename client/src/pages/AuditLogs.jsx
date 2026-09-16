import { useEffect, useState } from 'react';
import api from '../api/axios';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/superadmin/audit-logs')
      .then((res) => setLogs(res.data))
      .catch(() => setError('Failed to load audit logs'));
  }, []);

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Audit Logs</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Action</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Details</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-3 font-medium">{log.action}</td>
                <td className="p-3">{log.actor?.name} ({log.actor?.role})</td>
                <td className="p-3 text-gray-600">{log.details}</td>
                <td className="p-3 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="p-4 text-gray-600">No audit logs yet.</p>}
      </div>
    </div>
  );
}

export default AuditLogs;