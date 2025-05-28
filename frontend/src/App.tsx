import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <nav style={{ margin: '10px' }}>
        <Link to='/'>Početna</Link> | <Link to='/login'>Login</Link> | <Link to='/admin'>Admin</Link>
      </nav>
      <Routes>
        <Route path='/' element={<h1>Katalog kafa</h1>} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
