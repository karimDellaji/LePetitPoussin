import { LayoutDashboard, Users, CheckCircle, ShieldCheck, Box, Camera, LogOut, CreditCard } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'eleves', label: 'Élèves', icon: Users },
    { id: 'presence', label: 'Présence', icon: CheckCircle },
    { id: 'staff', label: 'Équipe', icon: ShieldCheck },
    { id: 'depenses', label: 'Dépenses', icon: CreditCard }, // <-- Ajouté ici
    { id: 'inventaire', label: 'Inventaire', icon: Box },
    { id: 'espace_parents', label: 'Médiathèque', icon: Camera },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.reload();
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col p-6 fixed top-0 left-0">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">P</div>
        <h1 className="font-black text-[10px] uppercase tracking-tighter">LePetitPoussin</h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
              activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>

      <button onClick={handleLogout} className="mt-8 flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs text-red-400 hover:bg-red-50 transition-all">
        <LogOut size={18} /> Déconnexion
      </button>
    </div>
  );
}