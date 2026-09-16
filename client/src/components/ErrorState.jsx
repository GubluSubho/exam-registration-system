function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <p className="text-red-600 font-semibold mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;