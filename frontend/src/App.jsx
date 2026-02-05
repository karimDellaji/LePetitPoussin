import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import { Lock, User, KeyRound, Users, GraduationCap, ShieldCheck } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '', code: '' });
  const [mode, setMode] = useState('parent'); // 'parent', 'teacher', 'admin'
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
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
        alert("Identifiants incorrects pour ce rôle.");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center p-6 font-sans">
        {/* LOGO & TITRE */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-emerald-100">
                <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Fresh Emerald</h1>
        </div>

        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-2 border border-emerald-50">
          {/* SÉLECTEUR DE RÔLE (ONGLETS) */}
          <div className="flex p-2 gap-1 bg-slate-50 rounded-[2.5rem] mb-6">
            <TabBtn active={mode === 'parent'} onClick={() => setMode('parent')} icon={<Users size={14}/>} label="Parent" />
            <TabBtn active={mode === 'teacher'} onClick={() => setMode('teacher')} icon={<GraduationCap size={14}/>} label="Prof" />
            <TabBtn active={mode === 'admin'} onClick={() => setMode('admin')} icon={<Lock size={14}/>} label="Admin" />
          </div>

          <div className="px-8 pb-10 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {mode === 'admin' ? (
                <>
                  <Input icon={<User/>} placeholder="Admin ID" value={credentials.username} onChange={v => setCredentials({...credentials, username: v})} />
                  <Input icon={<Lock/>} placeholder="Password" type="password" value={credentials.password} onChange={v => setCredentials({...credentials, password: v})} />
                </>
              ) : (
                <Input icon={<KeyRound/>} placeholder={`Code ${mode === 'parent' ? 'POU-XXX' : 'ENS-XXX'}`} value={credentials.code} onChange={v => setCredentials({...credentials, code: v.toUpperCase()})} />
              )}

              <button disabled={isLoading} className="w-full bg-emerald-500 hover:bg-slate-800 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-emerald-100 transition-all">
                {isLoading ? "Vérification..." : "Accéder à l'espace"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === 'admin' && <AdminDashboard onLogout={() => {setUser(null); setRole(null);}} />}
      {role === 'teacher' && <TeacherDashboard teacher={user} onLogout={() => {setUser(null); setRole(null);}} />}
      {role === 'parent' && <ParentDashboard child={user} onLogout={() => {setUser(null); setRole(null);}} />}
    </>
  );
}

// Sous-composants pour la propreté
const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon} {label}
  </button>
);

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-5 top-5 text-slate-300">{icon}</span>
    <input {...props} onChange={e => props.onChange(e.target.value)} className="w-full bg-slate-50 p-5 pl-14 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200 transition-all placeholder:text-slate-300" />
  </div>
);