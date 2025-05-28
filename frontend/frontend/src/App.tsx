import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AdminPanel } from './pages/AdminPanel';
import Katalog from './pages/Katalog';
import ListaMesavina from './pages/ListaMesavina';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Katalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/mesavine/novi" element={<AdminPanel />} />
        <Route path="/admin/mesavine/lista" element={<ListaMesavina />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
