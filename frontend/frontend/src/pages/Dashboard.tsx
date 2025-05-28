import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Dobrodošli, admin!</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/admin/mesavine/novi')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nova mešavina
        </button>
        <button
          onClick={() => alert('Dolazi uskoro...')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Lista mešavina
        </button>
      </div>
    </div>
  );
}
