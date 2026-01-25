import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState(''); // Utilisé pour Admin et Nom Enseignante
  const [password, setPassword] = useState(''); // Utilisé pour Admin
  const [code, setCode] = useState(''); // Utilisé pour Enseignante et Parent
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const body = { roleType: role };
    if (role === 'admin') { 
        body.username = username; 
        body.password = password; 
    } else if (role === 'teacher') { 
        body.username = username; 
        body.codeAcces = code; 
    } else { 
        body.code = code; 
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(data);
      } else {
        setError(data.message || "Accès refusé");
      }
    } catch (err) {
      setError("Le serveur ne répond pas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 font-sans text-slate-700">
      <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] w-full max-w-md border border-slate-50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-inner">P</div>
          <h1 className="text-xl font-black text-slate-800 tracking-[0.2em] uppercase">Petit Poussin</h1>
        </div>

        {/* SELECTEUR DE ROLE */}
        <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
          {['admin', 'teacher', 'parent'].map(r => (
            <button key={r} type="button" onClick={() => setRole(r)} className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${role === r ? 'bg-white shadow-sm text-emerald-600 border border-slate-100' : 'text-slate-400'}`}>
              {r === 'teacher' ? 'Enseignante' : r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'admin' && (
            <>
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 font-bold transition-all" placeholder="Utilisateur" value={username} onChange={e => setUsername(e.target.value)} />
              <input required type="password" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 font-bold transition-all" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            </>
          )}

          {role === 'teacher' && (
            <>
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 font-bold transition-all" placeholder="Votre Nom" value={username} onChange={e => setUsername(e.target.value)} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 font-bold transition-all" placeholder="Code ENS-XXX" value={code} onChange={e => setCode(e.target.value)} />
            </>
          )}

          {role === 'parent' && (
            <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 font-bold transition-all" placeholder="Code Parent" value={code} onChange={e => setCode(e.target.value)} />
          )}

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-50 p-3 rounded-xl">{error}</p>}

          <button type="submit" className="w-full bg-emerald-500 text-white p-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all mt-4">
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
}