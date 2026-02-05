import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, GraduationCap, Wallet, Image as ImageIcon, 
  Settings, Plus, Trash2, Edit, X, Phone, CheckCircle2, XCircle, 
  TrendingUp, TrendingDown, Search, ChevronRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [children, setChildren] = useState([]);
  const [staff, setStaff] = useState([]);
  const [finances, setFinances] = useState({ transactions: [], bilan: { solde: 0, recettes: 0, depenses: 0 } });
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('eleves'); // 'eleves', 'staff', 'finance'
  const [form, setForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadData(); }, [activeTab]);

  const loadData = async () => {
    try {
      const resC = await fetch(`${API_BASE_URL}/api/children`);
      const resS = await fetch(`${API_BASE_URL}/api/staff`);
      const resF = await fetch(`${API_BASE_URL}/api/finance/all`);
      setChildren(await resC.json());
      setStaff(await resS.json());
      setFinances(await resF.json());
    } catch (e) { console.error("Erreur de chargement"); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const endpoint = modalType === 'eleves' ? 'children' : (modalType === 'staff' ? 'staff' : 'finance');
    try {
      const res = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if(res.ok) { setShowModal(false); setForm({}); loadData(); }
      else { alert("Erreur lors de l'enregistrement"); }
    } catch (e) { alert("Erreur serveur"); }
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Supprimer ?")) return;
    await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="flex min-h-screen bg-[#FDFEFE] font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-50 flex flex-col p-8 fixed h-full">
        <div className="mb-12">
          <h2 className="text-xl font-black text-slate-800 tracking-tighter italic uppercase">Le Petit <span className="text-emerald-500">POUSSIN</span></h2>
        </div>
        <nav className="space-y-2 flex-1">
          <MenuBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <MenuBtn active={activeTab === 'eleves'} onClick={() => setActiveTab('eleves')} icon={<Users size={20}/>} label="Élèves" />
          <MenuBtn active={activeTab === 'personnel'} onClick={() => setActiveTab('personnel')} icon={<GraduationCap size={20}/>} label="Personnel" />
          <MenuBtn active={activeTab === 'finances'} onClick={() => setActiveTab('finances')} icon={<Wallet size={20}/>} label="Finances" />
        </nav>
        <button onClick={onLogout} className="text-slate-300 hover:text-red-500 font-black uppercase text-[10px] p-4 flex items-center gap-3">Déconnexion</button>
      </aside>

      {/* CONTENU */}
      <main className="ml-72 flex-1 p-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">{activeTab}</h1>
          {activeTab !== 'dashboard' && (
            <button onClick={() => { setModalType(activeTab === 'finances' ? 'finance' : activeTab); setShowModal(true); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 shadow-xl shadow-slate-200">
              <Plus size={18}/> Ajouter {activeTab === 'finances' ? 'Transaction' : 'Nouveau'}
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-3 gap-8">
            <StatCard label="Élèves" value={children.length} icon={<Users className="text-emerald-500"/>} />
            <StatCard label="Staff" value={staff.length} icon={<GraduationCap className="text-blue-500"/>} />
            <StatCard label="Solde" value={finances.bilan.solde + " DT"} icon={<Wallet className="text-orange-500"/>} />
          </div>
        )}

        {activeTab === 'eleves' && (
          <div className="grid grid-cols-3 gap-6">
            {children.map(c => (
              <div key={c._id} className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-100 relative group">
                <button onClick={() => deleteItem('children', c._id)} className="absolute top-8 right-8 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black mb-4">{c.prenom[0]}</div>
                <h3 className="font-black text-slate-800 uppercase">{c.prenom} {c.nom}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">{c.section}</p>
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-4"><Phone size={14}/> {c.parentTel}</div>
                <div className="border-t pt-4 flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase flex items-center gap-2 ${c.estPaye ? 'text-emerald-500' : 'text-red-400'}`}>
                        {c.estPaye ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {c.estPaye ? 'Payé' : 'Impayé'}
                    </span>
                    <span className="bg-slate-900 text-white text-[9px] px-3 py-1 rounded-full">{c.parentCode}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'personnel' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr><th className="p-8">Membre</th><th className="p-8">Rôle</th><th className="p-8">Code</th><th className="p-8">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {staff.map(s => (
                        <tr key={s._id} className="hover:bg-slate-50/50">
                            <td className="p-8 font-black text-slate-700 uppercase">{s.nomComplet}</td>
                            <td className="p-8 font-bold text-slate-400 text-xs uppercase">{s.role}</td>
                            <td className="p-8 font-mono font-black text-emerald-500">{s.loginCode}</td>
                            <td className="p-8">
                                <button onClick={() => deleteItem('staff', s._id)} className="text-slate-200 hover:text-red-500"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        )}

        {activeTab === 'finances' && (
            <div className="space-y-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem]">
                        <p className="text-[10px] font-black uppercase opacity-50 mb-4">Solde Actuel</p>
                        <h2 className="text-4xl font-black italic">{finances.bilan.solde} DT</h2>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-50">
                        <p className="text-[10px] font-black text-emerald-500 uppercase mb-4">Recettes</p>
                        <h2 className="text-4xl font-black text-slate-800 italic">{finances.bilan.recettes} DT</h2>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border border-red-100 shadow-xl shadow-red-50">
                        <p className="text-[10px] font-black text-red-500 uppercase mb-4">Dépenses</p>
                        <h2 className="text-4xl font-black text-slate-800 italic">{finances.bilan.depenses} DT</h2>
                    </div>
                </div>
                <div className="bg-white rounded-[3rem] shadow-2xl p-10">
                    <h3 className="font-black text-xs uppercase text-slate-400 mb-8">Transactions</h3>
                    <div className="space-y-4">
                        {finances.transactions.map(t => (
                            <div key={t._id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${t.type === 'Recette' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                        {t.type === 'Recette' ? <TrendingUp size={20}/> : <TrendingDown size={20}/>}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm uppercase">{t.description}</p>
                                        <p className="text-[9px] font-bold text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <p className={`font-black text-lg ${t.type === 'Recette' ? 'text-emerald-500' : 'text-red-500'}`}>{t.type === 'Recette' ? '+' : '-'}{t.montant} DT</p>
                                    <button onClick={() => deleteItem('finance', t._id)} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 relative">
                <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300"><X/></button>
                <h2 className="text-2xl font-black text-slate-800 uppercase mb-8">Nouveau {modalType}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    {modalType === 'eleves' && (
                        <>
                            <Input placeholder="Prénom" onChange={v => setForm({...form, prenom: v})} />
                            <Input placeholder="Nom" onChange={v => setForm({...form, nom: v})} />
                            <select className="w-full bg-slate-50 p-5 rounded-2xl font-bold" onChange={e => setForm({...form, section: e.target.value})} required>
                                <option value="">Section...</option><option value="Petite Section">Petite Section</option><option value="Moyenne Section">Moyenne Section</option><option value="Grande Section">Grande Section</option>
                            </select>
                            <Input placeholder="Tarif" type="number" onChange={v => setForm({...form, tarif: v})} />
                            <Input placeholder="Tél Parent" onChange={v => setForm({...form, parentTel: v})} />
                        </>
                    )}
                    {modalType === 'staff' && (
                        <>
                            <Input placeholder="Nom Complet" onChange={v => setForm({...form, nomComplet: v})} />
                            <select className="w-full bg-slate-50 p-5 rounded-2xl font-bold" onChange={e => setForm({...form, role: e.target.value})} required>
                                <option value="">Choisir Rôle...</option><option value="Directrice">Directrice</option><option value="Enseignante">Enseignante</option><option value="Aide">Aide</option>
                            </select>
                            <Input placeholder="Salaire" type="number" onChange={v => setForm({...form, salaire: v})} />
                            <Input placeholder="Téléphone" onChange={v => setForm({...form, telephone: v})} />
                        </>
                    )}
                    {modalType === 'finance' && (
                        <>
                            <select className="w-full bg-slate-50 p-5 rounded-2xl font-bold" onChange={e => setForm({...form, type: e.target.value})} required>
                                <option value="">Type...</option><option value="Recette">Recette (+)</option><option value="Depense">Dépense (-)</option>
                            </select>
                            <Input placeholder="Montant" type="number" onChange={v => setForm({...form, montant: v})} />
                            <Input placeholder="Description" onChange={v => setForm({...form, description: v})} />
                        </>
                    )}
                    <button className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest mt-4 shadow-lg shadow-emerald-100">Enregistrer</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

const MenuBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${active ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-100' : 'text-slate-400 hover:bg-slate-50'}`}>{icon} {label}</button>
);

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50">
    <div className="flex justify-between items-start mb-6"><div className="p-3 bg-slate-50 rounded-2xl">{icon}</div><p className="font-black text-[10px] uppercase text-slate-300">{label}</p></div>
    <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">{value}</h2>
  </div>
);

const Input = ({ placeholder, type="text", onChange }) => (
  <input type={type} placeholder={placeholder} className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200" onChange={e => onChange(e.target.value)} required />
);