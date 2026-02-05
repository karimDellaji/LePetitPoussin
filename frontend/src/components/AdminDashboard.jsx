import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, GraduationCap, Wallet, Image as ImageIcon, 
  Settings, Plus, Search, CheckCircle2, XCircle, TrendingUp, 
  TrendingDown, LogOut, X, Trash2, Edit, Phone, Camera, 
  UploadCloud, Filter, Calendar, ChevronRight, MoreVertical
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard({ onLogout }) {
  // États de navigation et données
  const [activeTab, setActiveTab] = useState('dashboard');
  const [children, setChildren] = useState([]);
  const [staff, setStaff] = useState([]);
  const [finances, setFinances] = useState({ transactions: [], bilan: { solde: 0, recettes: 0, depenses: 0 } });
  const [media, setMedia] = useState([]);
  
  // États de l'interface
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Chargement initial
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resC, resS, resF, resM] = await Promise.all([
        fetch(`${API_BASE_URL}/api/children`),
        fetch(`${API_BASE_URL}/api/staff`),
        fetch(`${API_BASE_URL}/api/finance/all`),
        fetch(`${API_BASE_URL}/api/media`)
      ]);
      
      const dataC = await resC.json();
      const dataS = await resS.json();
      const dataF = await resF.json();
      const dataM = await resM.json();

      setChildren(dataC);
      setStaff(dataS);
      setFinances(dataF);
      setMedia(dataM);
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ÉLÈVES / STAFF ---

  const handleSave = async (e) => {
    e.preventDefault();
    const type = activeTab === 'eleves' ? 'children' : 'staff';
    const url = modalMode === 'add' ? `${API_BASE_URL}/api/${type}` : `${API_BASE_URL}/api/${type}/${editingId}`;
    const method = modalMode === 'add' ? 'POST' : 'PATCH';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowModal(false);
        setForm({});
        loadData();
      }
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    const endpoint = type === 'eleve' ? 'children' : 'staff';
    try {
      await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert("Erreur de suppression");
    }
  };

  const togglePayment = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/children/${id}/toggle-payment`, { method: 'PATCH' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (item, type) => {
    setModalMode('edit');
    setEditingId(item._id);
    setForm(item);
    setShowModal(true);
  };

  // --- ACTIONS MÉDIAS ---

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', "Activité Le Petit Poussin");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) loadData();
    } catch (err) {
      alert("Erreur lors de l'upload");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDU DES COMPOSANTS ---

  return (
    <div className="flex min-h-screen bg-[#FDFEFE] font-sans">
      
      {/* SIDEBAR GAUCHE */}
      <aside className="w-80 bg-white border-r border-slate-50 flex flex-col p-8 fixed h-full z-20">
        <div className="mb-12 px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <Camera size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">
              Le Petit <span className="text-emerald-500">POUSSIN</span>
            </h2>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Tableau de Direction</p>
        </div>

        <nav className="space-y-2 flex-1">
          <MenuLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <MenuLink active={activeTab === 'eleves'} onClick={() => setActiveTab('eleves')} icon={<Users size={20}/>} label="Élèves" />
          <MenuLink active={activeTab === 'personnel'} onClick={() => setActiveTab('personnel')} icon={<GraduationCap size={20}/>} label="Personnel" />
          <MenuLink active={activeTab === 'finances'} onClick={() => setActiveTab('finances')} icon={<Wallet size={20}/>} label="Finances" />
          <MenuLink active={activeTab === 'medias'} onClick={() => setActiveTab('medias')} icon={<ImageIcon size={20}/>} label="Médiathèque" />
          <MenuLink active={activeTab === 'reglages'} onClick={() => setActiveTab('reglages')} icon={<Settings size={20}/>} label="Paramètres" />
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto flex items-center gap-4 p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* ZONE DE CONTENU */}
      <main className="flex-1 ml-80 p-12">
        
        {/* HEADER DYNAMIQUE */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">
                {activeTab === 'dashboard' ? 'Tableau de Bord' : activeTab}
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" /> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
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
            {['eleves', 'personnel'].includes(activeTab) && (
              <button 
                onClick={() => { setModalMode('add'); setForm({}); setShowModal(true); }}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200"
              >
                <Plus size={18}/> Nouveau
              </button>
            )}
            {activeTab === 'medias' && (
              <label className="bg-emerald-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100">
                <UploadCloud size={18}/> Publier Photo <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        </header>

        {/* --- VUE DASHBOARD (STATISTIQUES) --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Effectif Total" value={children.length} trend="+2 ce mois" icon={<Users className="text-emerald-500"/>} />
              <StatCard label="Staff Actif" value={staff.length} trend="Complet" icon={<GraduationCap className="text-blue-500"/>} />
              <StatCard label="Recettes Mensuelles" value={finances.bilan.recettes + " DT"} trend="Paiements en cours" icon={<TrendingUp className="text-emerald-500"/>} />
              <StatCard label="Taux de présence" value="94%" trend="Excellent" icon={<CheckCircle2 className="text-orange-500"/>} />
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-2xl shadow-slate-100">
                    <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-6 flex justify-between">
                        Paiements Récents <ChevronRight size={16}/>
                    </h3>
                    <div className="space-y-4">
                        {children.filter(c => c.estPaye).slice(0, 4).map(c => (
                            <div key={c._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                <span className="font-bold text-slate-700">{c.prenom} {c.nom}</span>
                                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full">{c.tarif} DT</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-2xl shadow-slate-100">
                    <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-6">Événements Prochains</h3>
                    <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                        <p className="text-slate-300 font-bold text-sm">Aucun événement prévu cette semaine</p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* --- VUE ÉLÈVES --- */}
        {activeTab === 'eleves' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {children.filter(c => c.prenom.toLowerCase().includes(searchTerm.toLowerCase())).map(child => (
              <div key={child._id} className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-2xl shadow-slate-100 relative group transition-all hover:-translate-y-2">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-100">
                    {child.prenom[0]}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                        {child.parentCode || 'SANS CODE'}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => openEditModal(child, 'eleve')} className="p-2 bg-slate-100 text-slate-400 hover:text-emerald-500 rounded-lg"><Edit size={16}/></button>
                        <button onClick={() => handleDelete('eleve', child._id)} className="p-2 bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-1">{child.prenom} {child.nom}</h3>
                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-4">{child.section}</p>
                
                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs mb-6 bg-slate-50 p-3 rounded-xl">
                    <Phone size={14} className="text-emerald-500"/> {child.parentTel || "Aucun téléphone"}
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <button 
                    onClick={() => togglePayment(child._id)}
                    className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl transition-colors ${child.estPaye ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'}`}
                  >
                    {child.estPaye ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
                    {child.estPaye ? 'Payé' : 'Impayé'}
                  </button>
                  <span className="text-slate-800 font-black text-lg">{child.tarif} <span className="text-[10px] text-slate-400">DT</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VUE PERSONNEL --- */}
        {activeTab === 'personnel' && (
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  <th className="p-8">Membre de l'équipe</th>
                  <th className="p-8">Rôle / Poste</th>
                  <th className="p-8">Code de Connexion</th>
                  <th className="p-8">Téléphone</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map(member => (
                  <tr key={member._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black">{member.nomComplet[0]}</div>
                        <span className="font-black text-slate-700 uppercase text-sm">{member.nomComplet}</span>
                      </div>
                    </td>
                    <td className="p-8">
                        <span className="bg-blue-50 text-blue-500 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">{member.role}</span>
                    </td>
                    <td className="p-8 font-mono font-black text-emerald-500 tracking-wider">{member.loginCode}</td>
                    <td className="p-8 font-bold text-slate-400 text-sm">{member.telephone || '---'}</td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => openEditModal(member, 'staff')} className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><Edit size={18}/></button>
                        <button onClick={() => handleDelete('staff', member._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VUE FINANCES --- */}
        {activeTab === 'finances' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FinanceCard label="Solde Actuel" value={finances.bilan.solde} type="total" />
              <FinanceCard label="Total Recettes" value={finances.bilan.recettes} type="plus" />
              <FinanceCard label="Total Dépenses" value={finances.bilan.depenses} type="minus" />
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-2xl">
               <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-8">Journal des Transactions</h3>
               <div className="space-y-4">
                  {finances.transactions.length === 0 && <p className="text-center text-slate-300 py-10 font-bold">Aucune transaction enregistrée</p>}
                  {finances.transactions.map(t => (
                    <div key={t._id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-emerald-100 transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'Recette' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {t.type === 'Recette' ? <TrendingUp size={20}/> : <TrendingDown size={20}/>}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm uppercase">{t.description}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString()} à {new Date(t.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <p className={`text-xl font-black ${t.type === 'Recette' ? 'text-emerald-500' : 'text-red-400'}`}>
                        {t.type === 'Recette' ? '+' : '-'}{t.montant} DT
                      </p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* --- VUE MÉDIAS --- */}
        {activeTab === 'medias' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {media.map(item => (
              <div key={item._id} className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden relative group border-8 border-white shadow-xl shadow-slate-100 transition-all hover:scale-105">
                <img src={item.url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <button className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-red-500 transition-all"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
            {media.length === 0 && <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase tracking-widest">La galerie est vide</div>}
          </div>
        )}
      </main>

      {/* --- MODAL D'AJOUT ET D'ÉDITION --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-800 transition-colors"><X size={32}/></button>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 text-center">
                {modalMode === 'add' ? 'Nouveau' : 'Modifier'} {activeTab === 'eleves' ? 'Élève' : 'Membre'}
            </h2>
            <p className="text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-10">Fresh Emerald System</p>
            
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              {activeTab === 'eleves' ? (
                <>
                  <InputBox label="Prénom" value={form.prenom} onChange={v => setForm({...form, prenom: v})} />
                  <InputBox label="Nom" value={form.nom} onChange={v => setForm({...form, nom: v})} />
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-300 ml-4 mb-2 block">Section Scolaire</label>
                    <select className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200 transition-all appearance-none" value={form.section} onChange={e => setForm({...form, section: e.target.value})} required>
                      <option value="">Sélectionner...</option>
                      <option value="Petite Section">Petite Section</option>
                      <option value="Moyenne Section">Moyenne Section</option>
                      <option value="Grande Section">Grande Section</option>
                    </select>
                  </div>
                  <InputBox label="Tarif (DT)" type="number" value={form.tarif} onChange={v => setForm({...form, tarif: v})} />
                  <InputBox label="Tél. Parent" value={form.parentTel} onChange={v => setForm({...form, parentTel: v})} />
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <InputBox label="Nom Complet" value={form.nomComplet} onChange={v => setForm({...form, nomComplet: v})} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-300 ml-4 mb-2 block">Rôle au sein du Petit Poussin</label>
                    <select className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200 transition-all appearance-none" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
                        <option value="">Choisir un rôle...</option>
                        <option value="Directrice">Directrice</option>
                        <option value="Enseignante">Enseignante</option>
                        <option value="Aide">Aide</option>
                    </select>
                  </div>
                  <InputBox label="Salaire" type="number" value={form.salaire} onChange={v => setForm({...form, salaire: v})} />
                  <InputBox label="Téléphone" value={form.telephone} onChange={v => setForm({...form, telephone: v})} />
                </>
              )}
              <button className="col-span-2 bg-emerald-500 text-white font-black py-6 rounded-3xl uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-100 mt-6 hover:bg-slate-900 transition-all transform active:scale-95">
                {modalMode === 'add' ? 'Enregistrer l\'entrée' : 'Appliquer les modifications'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PETITS COMPOSANTS UTILES ---

function MenuLink({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${active ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-100' : 'text-slate-400 hover:bg-slate-50 hover:pl-7'}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, trend, icon }) {
  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-slate-50 rounded-2xl shadow-inner">{icon}</div>
        <div className="text-right">
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-300 mb-1">{label}</p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h2>
        </div>
      </div>
      <p className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full inline-block">{trend}</p>
    </div>
  );
}

function FinanceCard({ label, value, type }) {
  const styles = {
    total: "bg-slate-900 text-white shadow-slate-200",
    plus: "bg-white text-slate-800 border-emerald-100",
    minus: "bg-white text-slate-800 border-red-100"
  };
  return (
    <div className={`p-10 rounded-[3.5rem] shadow-2xl border-2 ${styles[type]}`}>
      <p className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 opacity-50">{label}</p>
      <h2 className="text-5xl font-black tracking-tighter italic">
        {value} <span className="text-xl font-medium not-italic opacity-40">DT</span>
      </h2>
    </div>
  );
}

function InputBox({ label, value, type="text", onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase text-slate-300 ml-4">{label}</label>
      <input 
        type={type}
        value={value || ''}
        className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-emerald-200 transition-all"
        onChange={e => onChange(e.target.value)}
        required
      />
    </div>
  );
}