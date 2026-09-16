function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}

export default LoadingSpinner;