import React, { useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import TeacherSpace from "./components/TeacherSpace";
import ParentSpace from "./components/ParentSpace";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  // 1. Si non connecté : On affiche ton Login "wonderful"
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // 2. Dispatcher selon le rôle
  if (user.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (user.role === 'teacher') {
    return <TeacherSpace user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'parent') {
    return <ParentSpace user={user} onLogout={handleLogout} />;
  }

  // Sécurité
  return (
    <div className="flex items-center justify-center min-h-screen font-black text-emerald-500">
      ERREUR DE RÔLE
      <button onClick={handleLogout} className="ml-4 underline text-slate-900">Retour</button>
    </div>
  );
}