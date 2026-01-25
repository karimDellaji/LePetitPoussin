import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// On change "pages" par "components" ici :
import Login from './components/Login'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* La page par défaut affiche le composant Login */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;