// src/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-2">403 - Unauthorized</h1>
      <p className="mb-4">You do not have permission to view this page.</p>
      <Link to="/dashboard" className="text-blue-600 underline">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
