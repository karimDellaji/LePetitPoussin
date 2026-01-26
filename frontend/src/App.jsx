import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Si l'utilisateur n'est pas connecté, il va sur Login */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/admin-dashboard" />} 
        />
        
        {/* Si l'utilisateur est connecté, il accède au Dashboard complet */}
        <Route 
          path="/admin-dashboard" 
          element={isAuthenticated ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;