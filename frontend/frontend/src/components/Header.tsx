import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-100 p-4 flex justify-center gap-6 shadow sticky top-0 z-10">
      <Link
        to="/login"
        className={`px-4 py-2 rounded ${
          isActive('/login') ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } border border-gray-800 hover:bg-gray-800 hover:text-white transition`}
      >
        Login
      </Link>

      <Link
        to="/admin/mesavine/novi"
        className={`px-4 py-2 rounded ${
          isActive('/admin/mesavine/novi') ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
        } border border-blue-600 hover:bg-blue-600 hover:text-white transition`}
      >
        Dodaj mešavinu
      </Link>

      <Link
        to="/"
        className={`px-4 py-2 rounded ${
          isActive('/') ? 'bg-green-600 text-white' : 'bg-white text-green-600'
        } border border-green-600 hover:bg-green-600 hover:text-white transition`}
      >
        Lista mešavina
      </Link>
    </header>
  );
};

export default Header;
