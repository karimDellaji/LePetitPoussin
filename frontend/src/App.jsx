import { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import ParentDashboard from './components/ParentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import { ShieldCheck, Users, GraduationCap, Lock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [mode, setMode] = useState('parent');
  const [credentials, setCredentials] = useState({ username: '', password: '', code: '' });
  const [loading, setLoading] = useState(false);

  const logout = () => {
    setUser(null);
    setRole(null);
    setCredentials({ username: '', password: '', code: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await res.json();
      
      if (res.ok) { 
        setUser(data.user); 
        setRole(data.role);
      } else {
        alert(data.message || "Accès refusé");
      }
    } catch (err) { 
      alert("Serveur injoignable. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  // Si l'utilisateur est connecté, afficher le bon dashboard
  if (user) {
    switch (role) {
      case 'admin':
        return <AdminDashboard onLogout={logout} />;
      case 'teacher':
        return <TeacherDashboard teacher={user} onLogout={logout} />;
      case 'parent':
        return <ParentDashboard child={user} onLogout={logout} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p>Rôle inconnu. Veuillez vous reconnecter.</p>
            <button onClick={logout}>Déconnexion</button>
          </div>
        );
    }
  }

  // Page de login
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-emerald-100">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
          Le Petit POUSSIN
        </h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
          Jardin d&apos;enfants
        </p>
      </div>
      
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-2 border border-emerald-50">
        <div className="flex p-2 gap-1 bg-slate-50 rounded-[2.5rem] mb-6">
          <TabBtn 
            active={mode === 'parent'} 
            onClick={() => setMode('parent')} 
            icon={<Users size={14}/>} 
            label="Parent" 
          />
          <TabBtn 
            active={mode === 'teacher'} 
            onClick={() => setMode('teacher')} 
            icon={<GraduationCap size={14}/>} 
            label="Prof" 
          />
          <TabBtn 
            active={mode === 'admin'} 
            onClick={() => setMode('admin')} 
            icon={<Lock size={14}/>} 
            label="Admin" 
          />
        </div>
        
        <form onSubmit={handleLogin} className="px-8 pb-10 space-y-4">
          {mode === 'admin' ? (
            <>
              <input 
                placeholder="Admin ID" 
                className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold" 
                value={credentials.username} 
                onChange={e => setCredentials({...credentials, username: e.target.value})} 
                autoComplete="off"
                required
              />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold" 
                value={credentials.password} 
                onChange={e => setCredentials({...credentials, password: e.target.value})} 
                autoComplete="off"
                required
              />
            </>
          ) : (
            <input 
              placeholder={`Code ${mode === 'parent' ? 'POU-XXXX' : 'ENS-XXXX'}`} 
              className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold" 
              value={credentials.code} 
              onChange={e => setCredentials({...credentials, code: e.target.value.toUpperCase()})} 
              autoComplete="off"
              required
            />
          )}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : "Accéder à l'espace"}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
        © 2024 Le Petit Poussin
      </p>
    </div>
  );
}

const TabBtn = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-400'
    }`}
  >
    {icon} {label}
  </button>
);
