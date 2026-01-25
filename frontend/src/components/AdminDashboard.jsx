import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: '🏠' },
    { id: 'enfants', label: 'Gestion Enfants', icon: '👶' },
    { id: 'personnel', label: 'Enseignantes', icon: '👩‍🏫' },
    { id: 'finance', label: 'Comptabilité', icon: '📈' },
    { id: 'evenements', label: 'Événements', icon: '📅' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex font-sans text-slate-700">
      {/* Sidebar Latérale */}
      <aside className="w-72 bg-white shadow-2xl rounded-r-[3rem] z-10 flex flex-col">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-200 mb-4">
            <span className="text-4xl">🐣</span>
          </div>
          <h2 className="text-xl font-black text-emerald-800 tracking-tighter">LE PETIT POUSSIN</h2>
          <div className="mt-2 py-1 px-3 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full inline-block">
            ADMINISTRATION V1.0
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-semibold ${
                activeSection === item.id
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-105'
                  : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-50 text-red-500 rounded-[1.5rem] font-bold hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-800">Bienvenue, Admin ✨</h1>
            <p className="text-slate-500 font-medium">Votre jardin d'enfants est sous contrôle.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-12 pr-6 py-3 bg-white border-none shadow-sm rounded-full w-64 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <span className="absolute left-4 top-3.5">🔍</span>
            </div>
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border-2 border-emerald-100">
              🔔
            </div>
          </div>
        </header>

        {/* Cartes de Stats - Look V1.0.0 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-9xl opacity-10 group-hover:scale-110 transition-transform">👶</div>
            <p className="text-emerald-100 font-bold uppercase text-xs tracking-widest">Élèves Totaux</p>
            <h3 className="text-5xl font-black mt-2">142</h3>
            <p className="mt-4 text-sm bg-white/20 inline-block px-3 py-1 rounded-full">+4 cette semaine</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50 relative overflow-hidden group">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Enseignantes</p>
            <h3 className="text-5xl font-black mt-2 text-slate-800">12</h3>
            <div className="mt-4 flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-xs font-bold">👩</div>
              ))}
              <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">+8</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Budget Mensuel</p>
            <h3 className="text-5xl font-black mt-2 text-emerald-600">8,450<span className="text-xl ml-1">DT</span></h3>
            <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[70%]"></div>
            </div>
          </div>
        </div>

        {/* Section Table/Liste */}
        <section className="mt-12 bg-white rounded-[3rem] shadow-sm border border-emerald-50 p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 italic">Dernières Inscriptions</h2>
            <button className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95">
              + Nouvel Élève
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-tighter">
                <th className="pb-4 font-bold">Nom de l'enfant</th>
                <th className="pb-4 font-bold">Classe</th>
                <th className="pb-4 font-bold">Statut Paiement</th>
                <th className="pb-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-t border-slate-50">
                <td className="py-5 font-bold">Yassine Mansour</td>
                <td>Petite Section</td>
                <td><span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">Payé</span></td>
                <td><button className="text-emerald-500 font-bold hover:underline">Détails</button></td>
              </tr>
              <tr className="border-t border-slate-50">
                <td className="py-5 font-bold">Sarra Ben Ali</td>
                <td>Moyenne Section</td>
                <td><span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">En attente</span></td>
                <td><button className="text-emerald-500 font-bold hover:underline">Détails</button></td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;