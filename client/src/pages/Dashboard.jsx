function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, {user.name} ({user.role})
      </h1>
    </div>
  );
}

export default Dashboard;