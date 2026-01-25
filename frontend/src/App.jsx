import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

// Importe tes dashboards ici (assure-toi que les fichiers existent)
// import AdminDashboard from './pages/AdminDashboard'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* La page par défaut est le Login */}
          <Route path="/" element={<Login />} />
          
          {/* On ajoute les autres routes ici plus tard */}
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;