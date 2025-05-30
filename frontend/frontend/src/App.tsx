import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Katalog from './pages/Katalog';
import ListaMesavina from './pages/ListaMesavina';
import Kontakt from "./pages/Kontakt";
import {AdminPanelDodajMesavinu} from './pages/AdminPanelDodajMesavinu';
//import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Katalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/mesavine/novi" element={<AdminPanelDodajMesavinu />} />
        <Route path="/admin/mesavine/lista" element={<ListaMesavina />} />
                <Route path="/kontakt" element={<Kontakt />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
