import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">The page you are looking for does not exist or an error occurred.</p>
        <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
