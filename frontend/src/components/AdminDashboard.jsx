import React, { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, Wallet, Image as ImageIcon, Settings, 
  Plus, Search, CheckCircle2, XCircle, TrendingUp, TrendingDown, 
  LogOut, X, Trash2, Edit, Camera, UploadCloud 
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('eleves');
  const [children, setChildren] = useState([]);
  const [staff, setStaff] = useState([]);
  const [finances, setFinances] = useState({ transactions: [], bilan: { solde: 0, recettes: 0, depenses: 0 } });
  const [media, setMedia] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    try {
      const endpoints = { 
        eleves: 'children', 
        personnel: 'staff', 
        finances: 'finance/all',
        medias: 'media' 
      };
      const res = await fetch(`${API_BASE_URL}/api/${endpoints[activeTab]}`);
      const data = await res.json();
      if (activeTab === 'eleves') setChildren(data);
      else if (activeTab === 'personnel') setStaff(data);
      else if (activeTab === 'finances') setFinances(data);
      else if (activeTab === 'medias') setMedia(data);
    } catch (err) { console.error("Erreur de chargement:", err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === 'eleves' ? 'children' : 'staff';
    try {
      const res = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({});
        fetchData();
      }
    } catch (err) { alert("Erreur lors de l'enregistrement"); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Supprimer définitivement cet élément ?")) return;
    const endpoint = activeTab === 'eleves' ? 'children' : 'staff';
    await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const togglePayment = async (id) => {
    await fetch(`${API_BASE_URL}/api/children/${id}/toggle-payment`, { method: 'PATCH' });
    fetchData();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', "Activité du jour");

    try {
      await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: 'POST',
        body: formData
      });
      fetchData();
    } catch (err) { alert("Erreur upload"); }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFEFE] font-sans">
      {/* SIDEBAR FIXE */}
      <aside className="w-72 bg-white border-r border-slate-50 flex flex-col p-8 fixed h-full z-10">
        <div className="mb-12 px-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">
            Fresh<span className="text-emerald-500">Emerald</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Administration</p>
        </div>

        <nav className="space-y-2 flex-1">
          <MenuLink active={activeTab === 'eleves'} onClick={() => setActiveTab('eleves')} icon={<Users size={20}/>} label="Élèves" />
          <MenuLink active={activeTab === 'personnel'} onClick={() => setActiveTab('personnel')} icon={<GraduationCap size={20}/>} label="Personnel" />
          <MenuLink active={activeTab === 'finances'} onClick={() => setActiveTab('finances')} icon={<Wallet size={20}/>} label="Finances" />
          <MenuLink active={activeTab === 'medias'} onClick={() => setActiveTab('medias')} icon={<ImageIcon size={20}/>} label="Médiathèque" />
          <MenuLink active={activeTab === 'reglages'} onClick={() => setActiveTab('reglages')} icon={<Settings size={20}/>} label="Réglages" />
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 p-4 text-slate-400 hover:text-red-500 transition-all font-black uppercase text-[10px] tracking-widest">
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Gestion {activeTab}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Serveur Live : {API_BASE_URL.includes('localhost') ? 'Local' : 'Render Cloud'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-white border border-slate-100 p-4 pl-12 rounded-2xl outline-none font-bold text-sm w-64 focus:border-emerald-200 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab !== 'finances' && activeTab !== 'medias' && (
              <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200">
                <Plus size={18}/> Nouveau
              </button>
            )}
            {activeTab === 'medias' && (
              <label className="bg-emerald-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-slate-900 transition-all">
                <UploadCloud size={18}/> Upload <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        </header>

        {/* VUE ÉLÈVES */}
        {activeTab === 'eleves' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {children.filter(c => c.prenom.toLowerCase().includes(searchTerm.toLowerCase())).map(child => (
              <div key={child._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-100 relative group transition-all hover:-translate-y-2">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">{child.prenom[0]}</div>
                  <div className="flex flex-col items-end">
                    <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-2">{child.parentCode}</span>
                    <button onClick={() => deleteItem(child._id)} className="opacity-0 group-hover:opacity-100 text-slate-200 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1">{child.prenom} {child.nom}</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">{child.section}</p>
                
                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <button onClick={() => togglePayment(child._id)} className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${child.estPaye ? 'text-emerald-500' : 'text-red-400'}`}>
                    {child.estPaye ? <CheckCircle2 size={16}/> : <XCircle size={16}/>} {child.estPaye ? 'Payé' : 'Impayé'}
                  </button>
                  <span className="text-slate-800 font-black text-sm">{child.tarif} DT</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VUE PERSONNEL */}
        {activeTab === 'personnel' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-100 border border-slate-50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  <th className="p-8">Membre</th>
                  <th className="p-8">Rôle</th>
                  <th className="p-8">Code Accès</th>
                  <th className="p-8">Salaire</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map(member => (
                  <tr key={member._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">{member.nomComplet[0]}</div>
                        <span className="font-black text-slate-700 uppercase text-sm">{member.nomComplet}</span>
                      </div>
                    </td>
                    <td className="p-8 font-bold text-slate-400 text-xs uppercase">{member.role}</td>
                    <td className="p-8 font-mono font-black text-emerald-500">{member.loginCode}</td>
                    <td className="p-8 font-black text-slate-700">{member.salaire || 0} DT</td>
                    <td className="p-8 text-right">
                      <button onClick={() => deleteItem(member._id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VUE FINANCES */}
        {activeTab === 'finances' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard label="Solde Total" value={finances.bilan.solde} color="slate-900" icon={<Wallet className="text-emerald-400"/>}/>
              <StatCard label="Recettes Mois" value={finances.bilan.recettes} color="white" icon={<TrendingUp className="text-emerald-500"/>}/>
              <StatCard label="Dépenses Mois" value={finances.bilan.depenses} color="white" icon={<TrendingDown className="text-red-400"/>}/>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-2xl">
               <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-8">Dernières Transactions</h3>
               <div className="space-y-4">
                  {finances.transactions.map(t => (
                    <div key={t._id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${t.type === 'Recette' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {t.type === 'Recette' ? <TrendingUp size={18}/> : <TrendingDown size={18}/>}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm uppercase">{t.description}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(t.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-black ${t.type === 'Recette' ? 'text-emerald-500' : 'text-red-400'}`}>
                        {t.type === 'Recette' ? '+' : '-'}{t.montant} DT
                      </p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* VUE MÉDIAS */}
        {activeTab === 'medias' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {media.map(item => (
              <div key={item._id} className="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden relative group border-4 border-white shadow-xl">
                <img src={item.url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL AJOUT (ÉLÈVE / STAFF) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-800 transition-colors"><X size={32}/></button>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-8 text-center">Nouveau {activeTab === 'eleves' ? 'Élève' : 'Membre Staff'}</h2>
            
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
              {activeTab === 'eleves' ? (
                <>
                  <Input placeholder="Prénom" onChange={v => setFormData({...formData, prenom: v})} />
                  <Input placeholder="Nom" onChange={v => setFormData({...formData, nom: v})} />
                  <div className="col-span-2">
                    <select className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200 transition-all appearance-none" onChange={e => setFormData({...formData, section: e.target.value})} required>
                      <option value="">Sélectionner Section</option>
                      <option value="Petite Section">Petite Section</option>
                      <option value="Moyenne Section">Moyenne Section</option>
                      <option value="Grande Section">Grande Section</option>
                    </select>
                  </div>
                  <Input placeholder="Tarif Mensuel" type="number" onChange={v => setFormData({...formData, tarif: v})} />
                  <Input placeholder="Remarque" onChange={v => setFormData({...formData, remarque: v})} />
                </>
              ) : (
                <>
                  <div className="col-span-2"><Input placeholder="Nom Complet" onChange={v => setFormData({...formData, nomComplet: v})} /></div>
                  <Input placeholder="Rôle (Enseignante...)" onChange={v => setFormData({...formData, role: v})} />
                  <Input placeholder="Salaire" type="number" onChange={v => setFormData({...formData, salaire: v})} />
                </>
              )}
              <button className="col-span-2 bg-emerald-500 text-white font-black py-6 rounded-2xl uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-100 mt-4 hover:bg-slate-900 transition-all">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPOSANTS INTERNES
function MenuLink({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${active ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-100 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className={`${color === 'slate-900' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'} p-10 rounded-[3rem] shadow-2xl border border-slate-50`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
        <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
      </div>
      <h2 className="text-4xl font-black tracking-tighter">{value} <span className="text-sm text-slate-500 font-bold uppercase italic ml-1">DT</span></h2>
    </div>
  );
}

function Input({ placeholder, type="text", onChange }) {
  return (
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200 transition-all"
      onChange={e => onChange(e.target.value)}
      required
    />
  );
}