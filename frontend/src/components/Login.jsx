import React, { useState } from 'react';

const API_BASE_URL = "http://localhost:5000"; // On cible ton PC

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setError(data.message || 'Identifiants invalides');
      }
    } catch (err) {
      setError('Serveur injoignable. Lance "node server.js" dans le dossier backend.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-emerald-100/50 w-full max-w-md border border-emerald-50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] mx-auto flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-200 mb-6">P</div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">BIENVENUE</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Le Petit Poussin — Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Identifiant"
            className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="text-red-500 text-xs font-bold text-center px-2">{error}</p>}

          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95 mt-4">
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
}