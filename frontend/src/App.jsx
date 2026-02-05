import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import { Lock, User, KeyRound } from 'lucide-react';

// Cette ligne choisit automatiquement l'URL de Render si elle existe, 
// sinon elle utilise ton localhost pour tes tests personnels.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '', code: '' });
  const [mode, setMode] = useState('code'); // 'admin' ou 'code'
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Utilisation de la constante API_BASE_URL ici
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setRole(data.role);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Accès refusé. Vérifiez vos informations.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      alert("Impossible de contacter le serveur. Vérifiez votre connexion internet ou si le serveur est réveillé.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-emerald-50 text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-emerald-100">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">Bienvenue</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">Fresh Emerald</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {mode === 'code' ? (
              <div className="relative">
                <KeyRound className="absolute left-5 top-5 text-slate-300" size={20} />
                <input 
                  className="w-full bg-slate-50 p-5 pl-14 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200 transition-all"
                  placeholder="CODE (ENS- ou POU-)"
                  value={credentials.code}
                  onChange={e => setCredentials({...credentials, code: e.target.value.toUpperCase()})}
                  required
                />
              </div>
            ) : (
              <>
                <div className="relative">
                  <User className="absolute left-5 top-5 text-slate-300" size={20} />
                  <input 
                    className="w-full bg-slate-50 p-5 pl-14 rounded-2xl outline-none font-bold focus:border-emerald-200 border border-transparent transition-all"
                    placeholder="Identifiant Admin"
                    value={credentials.username}
                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-5 text-slate-300" size={20} />
                  <input 
                    type="password"
                    className="w-full bg-slate-50 p-5 pl-14 rounded-2xl outline-none font-bold focus:border-emerald-200 border border-transparent transition-all"
                    placeholder="Mot de passe"
                    value={credentials.password}
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-slate-400' : 'bg-emerald-500 hover:bg-slate-800'} text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-lg shadow-emerald-100 transition-all`}
            >
              {isLoading ? "Connexion..." : "Se Connecter"}
            </button>
          </form>

          <button 
            onClick={() => { setMode(mode === 'code' ? 'admin' : 'code'); setCredentials({username:'', password:'', code:''}); }}
            className="mt-8 text-[10px] font-black uppercase text-slate-300 hover:text-emerald-500 transition-colors"
          >
            {mode === 'code' ? "Accès Administration" : "Connexion par Code"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === 'admin' && <AdminDashboard onLogout={() => { setUser(null); setRole(null); }} />}
      {role === 'teacher' && <TeacherDashboard teacher={user} onLogout={() => { setUser(null); setRole(null); }} />}
      {role === 'parent' && <ParentDashboard child={user} onLogout={() => { setUser(null); setRole(null); }} />}
    </>
  );
}