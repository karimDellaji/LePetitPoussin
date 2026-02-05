import React from 'react';
import { 
  LayoutDashboard, Users, UserCheck, CheckCircle, 
  CreditCard, LogOut 
} from 'lucide-react';

export default function Sidebar({ tab, setTab, onLogout, pendingCount }) {
  const menuItems = [
    { id: 'stats', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'eleves', label: 'Élèves', icon: Users },
    { id: 'staff', label: 'Personnel', icon: UserCheck },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'approbation', label: 'Approbation', icon: CheckCircle, badge: pendingCount },
  ];

  return (
    <aside className="w-72 bg-white fixed h-full shadow-sm p-8 flex flex-col border-r border-emerald-50">
      {/* LOGO SECTION */}
      <div className="mb-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black mb-3 shadow-lg shadow-emerald-100">
          P
        </div>
        <span className="font-black text-slate-800 text-lg uppercase text-center leading-tight tracking-tighter">
          Le Petit<br/>Poussin
        </span>
      </div>
      
      {/* NAVIGATION */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.8rem] font-bold text-sm transition-all relative group ${
              tab === item.id 
              ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-100' 
              : 'text-slate-400 hover:bg-slate-50 hover:text-emerald-500'
            }`}
          >
            <item.icon size={20} />
            <span className="uppercase tracking-tighter">{item.label}</span>
            {item.badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* LOGOUT BOTTON */}
      <button 
        onClick={onLogout}
        className="mt-auto flex items-center gap-4 px-6 py-4 rounded-[1.8rem] font-bold text-sm text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-tighter"
      >
        <LogOut size={20} /> Quitter
      </button>
    </aside>
  );
}