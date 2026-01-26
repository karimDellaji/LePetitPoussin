import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/admin-dashboard" />} />
        <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard onLogout={() => { localStorage.clear(); setIsAuthenticated(false); }} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;