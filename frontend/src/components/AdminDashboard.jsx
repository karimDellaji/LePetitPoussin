import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { 
  Plus, Trash2, RefreshCcw, Phone, Edit3, UserPlus, 
  Wallet, Lock, CheckCircle2, XCircle, Users, 
  TrendingUp, Bell, Image as ImageIcon, Search
} from 'lucide-react';

const API_BASE_URL = "http://localhost:5000";

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('stats');
  const [eleves, setEleves] = useState([]);
  const [staff, setStaff] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [financeData, setFinanceData] = useState({ 
    transactions: [], 
    bilan: { recettes: 0, depenses: 0, solde: 0 } 
  });

  // --- États des Formulaires ---
  const [eleveForm, setEleveForm] = useState({ prenom: '', nom: '', telephone: '', section: 'Petite Section', tarif: '' });
  const [staffForm, setStaffForm] = useState({ nomComplet: '', role: 'Enseignante', salaire: '', telephone: '' });
  const [financeForm, setFinanceForm] = useState({ type: 'Recette', categorie: 'Scolarité', montant: '', description: '' });
  
  const [editingEleveId, setEditingEleveId] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);

  const fetchData = async () => {
    try {
      const [resE, resS, resP, resF] = await Promise.all([
        fetch(`${API_BASE_URL}/api/children`),
        fetch(`${API_BASE_URL}/api/staff`),
        fetch(`${API_BASE_URL}/api/teacher/events/all`),
        fetch(`${API_BASE_URL}/api/finance/all`)
      ]);
      setEleves(await resE.json());
      setStaff(await resS.json());
      const events = await resP.json();
      setPendingEvents(events.filter(ev => !ev.approuve));
      setFinanceData(await resF.json());
    } catch (err) { console.error("Sync Error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- LOGIQUE ÉLÈVES (Avec code POU-XXX) ---
  const handleEleveSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingEleveId;
    const url = isEdit ? `${API_BASE_URL}/api/children/${editingEleveId}` : `${API_BASE_URL}/api/children`;
    
    const payload = { ...eleveForm };
    if (!isEdit) payload.parentCode = `POU-${Math.floor(100 + Math.random() * 899)}`;

    await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setEleveForm({ prenom: '', nom: '', telephone: '', section: 'Petite Section', tarif: '' });
    setEditingEleveId(null);
    fetchData();
  };

  const togglePayment = async (enfant) => {
    await fetch(`${API_BASE_URL}/api/children/${enfant._id}/toggle-payment`, { method: 'PATCH' });
    if (!enfant.estPaye) {
      await fetch(`${API_BASE_URL}/api/finance/add`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'Recette', categorie: 'Scolarité', 
          montant: Number(enfant.tarif), 
          description: `Mensualité : ${enfant.prenom} ${enfant.nom}` 
        })
      });
    }
    fetchData();
  };

  // --- LOGIQUE STAFF (Avec code ENS-XXX) ---
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingStaffId;
    const url = isEdit ? `${API_BASE_URL}/api/staff/${editingStaffId}` : `${API_BASE_URL}/api/staff`;
    
    const payload = { ...staffForm };
    if (!isEdit) payload.loginCode = `ENS-${Math.floor(100 + Math.random() * 899)}`;

    await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setStaffForm({ nomComplet: '', role: 'Enseignante', salaire: '', telephone: '' });
    setEditingStaffId(null);
    fetchData();
  };

  // --- LOGIQUE FINANCE ---
  const handleFinanceSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/api/finance/add`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(financeForm)
    });
    setFinanceForm({ type: 'Recette', categorie: 'Scolarité', montant: '', description: '' });
    fetchData();
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      <Sidebar tab={tab} setTab={setTab} onLogout={onLogout} pendingCount={pendingEvents.length} />

      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center text-white">
                <Search size={24}/>
             </div>
             <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">{tab}</h2>
          </div>
          <button onClick={fetchData} className="p-4 bg-white rounded-full text-emerald-500 shadow-sm hover:rotate-180 transition-all duration-500">
            <RefreshCcw size={20}/>
          </button>
        </header>

        {/* --- STATS --- */}
        {tab === 'stats' && (
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-50 relative overflow-hidden">
              <Users className="absolute -right-4 -bottom-4 text-emerald-50 size-32" />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Inscrits</p>
              <h3 className="text-5xl font-black text-slate-800">{eleves.length}</h3>
            </div>
            <div className="bg-emerald-500 p-10 rounded-[3rem] shadow-xl text-white shadow-emerald-100">
              <TrendingUp className="mb-4 opacity-30" />
              <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest mb-2">Solde Caisse</p>
              <h3 className="text-5xl font-black">{financeData.bilan?.solde || 0} <span className="text-xl">DT</span></h3>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-red-50">
              <Bell className="text-red-500 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">À Approuver</p>
              <h3 className="text-5xl font-black text-red-500">{pendingEvents.length}</h3>
            </div>
          </div>
        )}

        {/* --- ÉLÈVES --- */}
        {tab === 'eleves' && (
          <div className="space-y-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-50">
              <h3 className="font-black uppercase text-emerald-600 mb-6 flex items-center gap-2"><Plus size={20}/> {editingEleveId ? "Modifier" : "Nouvelle Fiche"}</h3>
              <form onSubmit={handleEleveSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Prénom" value={eleveForm.prenom} onChange={e => setEleveForm({...eleveForm, prenom: e.target.value})} required />
                <input className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Nom" value={eleveForm.nom} onChange={e => setEleveForm({...eleveForm, nom: e.target.value})} required />
                <input className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Tél Parent" value={eleveForm.telephone} onChange={e => setEleveForm({...eleveForm, telephone: e.target.value})} required />
                <select className="bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none" value={eleveForm.section} onChange={e => setEleveForm({...eleveForm, section: e.target.value})}>
                  <option value="Petite Section">Petite Section</option>
                  <option value="Moyenne Section">Moyenne Section</option>
                  <option value="Grande Section">Grande Section</option>
                </select>
                <input type="number" className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Tarif Mensuel" value={eleveForm.tarif} onChange={e => setEleveForm({...eleveForm, tarif: e.target.value})} required />
                <button type="submit" className="bg-emerald-500 text-white font-black rounded-3xl uppercase text-xs py-5 col-span-3 hover:bg-slate-800 transition-all shadow-lg shadow-emerald-100">Valider</button>
              </form>
            </div>

            {['Petite Section', 'Moyenne Section', 'Grande Section'].map(sec => (
              <div key={sec} className="space-y-6">
                <h3 className="text-emerald-600 font-black uppercase text-xs tracking-[0.3em] ml-6">{sec}s</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {eleves.filter(e => e.section === sec).map(e => (
                    <div key={e._id} className="bg-white p-8 rounded-[3.5rem] shadow-md border border-slate-50 group hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="font-black text-slate-800 uppercase text-lg leading-tight">{e.prenom}<br/>{e.nom}</h4>
                        <div className="flex gap-2">
                          <button onClick={() => {setEditingEleveId(e._id); setEleveForm(e)}} className="p-2 text-emerald-500 bg-emerald-50 rounded-xl"><Edit3 size={14}/></button>
                          <button onClick={async () => { if(window.confirm("Supprimer ?")) { await fetch(`${API_BASE_URL}/api/children/${e._id}`, {method:'DELETE'}); fetchData(); } }} className="p-2 text-red-500 bg-red-50 rounded-xl"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-500 font-bold text-xs"><Phone size={14} className="text-emerald-500"/> {e.telephone}</div>
                        <div className="bg-slate-800 text-white p-4 rounded-3xl flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase opacity-60 flex items-center gap-1"><Lock size={10}/> Accès Parent</span>
                          <span className="font-black text-xs tracking-widest">{e.parentCode}</span>
                        </div>
                        <button onClick={() => togglePayment(e)} className={`w-full py-4 rounded-3xl text-[10px] font-black uppercase flex items-center justify-center gap-3 transition-all ${e.estPaye ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                          {e.estPaye ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {e.estPaye ? 'Payé' : 'Impayé'} ({e.tarif} DT)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- PERSONNEL --- */}
        {tab === 'staff' && (
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-50">
              <h3 className="font-black uppercase text-emerald-600 mb-6 flex items-center gap-2"><UserPlus size={20}/> Recrutement</h3>
              <form onSubmit={handleStaffSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Nom Complet" value={staffForm.nomComplet} onChange={e => setStaffForm({...staffForm, nomComplet: e.target.value})} required />
                <input className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Téléphone" value={staffForm.telephone} onChange={e => setStaffForm({...staffForm, telephone: e.target.value})} required />
                <select className="bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})}>
                  <option value="Enseignante">Enseignante</option>
                  <option value="Aide Soignante">Aide Soignante</option>
                </select>
                <input type="number" className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Salaire" value={staffForm.salaire} onChange={e => setStaffForm({...staffForm, salaire: e.target.value})} required />
                <button type="submit" className="bg-emerald-500 text-white font-black rounded-3xl uppercase text-xs py-5 col-span-full hover:bg-slate-800 transition-all shadow-lg shadow-emerald-100">
                  {editingStaffId ? "Mettre à jour" : "Enregistrer"}
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {staff.map(member => (
                <div key={member._id} className="bg-white p-8 rounded-[3.5rem] shadow-md border border-slate-50 group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-slate-800 uppercase text-lg leading-tight">{member.nomComplet}</h4>
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase mt-2 inline-block">{member.role}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingStaffId(member._id); setStaffForm(member); }} className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-500 rounded-2xl transition-all"><Edit3 size={16}/></button>
                      <button onClick={async () => { if(window.confirm("Supprimer ?")) { await fetch(`${API_BASE_URL}/api/staff/${member._id}`, {method:'DELETE'}); fetchData(); } }} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm"><Phone size={14} className="text-emerald-500"/> {member.telephone}</div>
                    <div className="bg-emerald-500 text-white p-4 rounded-3xl flex items-center justify-between shadow-lg shadow-emerald-100">
                      <div className="flex items-center gap-2 font-black text-[10px] uppercase"><Lock size={12} className="text-emerald-200"/> Accès Prof</div>
                      <span className="font-black tracking-widest text-sm">{member.loginCode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- FINANCE --- */}
        {tab === 'finance' && (
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-50">
              <h3 className="font-black uppercase text-emerald-600 mb-6 flex items-center gap-2"><Wallet size={20}/> Nouvelle Transaction</h3>
              <form onSubmit={handleFinanceSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select className="bg-slate-50 p-5 rounded-2xl font-bold text-sm" value={financeForm.type} onChange={e => setFinanceForm({...financeForm, type: e.target.value})}>
                  <option value="Recette">Recette (+)</option>
                  <option value="Dépense">Dépense (-)</option>
                </select>
                <input className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Catégorie" value={financeForm.categorie} onChange={e => setFinanceForm({...financeForm, categorie: e.target.value})} required />
                <input type="number" className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm" placeholder="Montant" value={financeForm.montant} onChange={e => setFinanceForm({...financeForm, montant: e.target.value})} required />
                <input className="bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm col-span-1" placeholder="Description" value={financeForm.description} onChange={e => setFinanceForm({...financeForm, description: e.target.value})} />
                <button type="submit" className="bg-emerald-500 text-white font-black rounded-3xl uppercase text-[10px] py-5 hover:bg-slate-800 transition-all">Valider</button>
              </form>
            </div>
            <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-50">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
                  <tr><th className="p-6">Date</th><th className="p-6">Description</th><th className="p-6 text-right">Montant</th><th className="p-6 text-center">Action</th></tr>
                </thead>
                <tbody>
                  {financeData.transactions.map(t => (
                    <tr key={t._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                      <td className="p-6 text-[10px] font-bold text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="p-6 text-sm font-black text-slate-800 uppercase">{t.description}</td>
                      <td className={`p-6 text-right font-black ${t.type === 'Recette' ? 'text-emerald-600' : 'text-red-500'}`}>{t.type === 'Recette' ? '+' : '-'}{t.montant} DT</td>
                      <td className="p-6 text-center">
                         <button onClick={async () => { if(window.confirm("Supprimer ?")) { await fetch(`${API_BASE_URL}/api/finance/${t._id}`, {method:'DELETE'}); fetchData(); } }} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- APPROBATION --- */}
        {tab === 'approbation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pendingEvents.length === 0 && <p className="text-slate-300 font-black uppercase tracking-widest text-center col-span-full py-20">Rien à valider pour le moment</p>}
            {pendingEvents.map(event => (
              <div key={event._id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-50 flex h-64">
                <div className="w-1/3 bg-slate-100 flex items-center justify-center">
                   {event.mediaUrl ? <img src={`${API_BASE_URL}${event.mediaUrl}`} className="w-full h-full object-cover" alt="event"/> : <ImageIcon size={40} className="text-slate-200" />}
                </div>
                <div className="w-2/3 p-8 flex flex-col justify-between">
                  <div>
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{event.type}</span>
                    <h4 className="font-black text-slate-800 uppercase text-lg mt-2 leading-tight">{event.titre}</h4>
                    <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase">Par : {event.enseignante}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={async () => { await fetch(`${API_BASE_URL}/api/teacher/events/${event._id}/approve`, {method:'PATCH'}); fetchData(); }} className="flex-1 bg-emerald-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-emerald-50">Approuver</button>
                    <button onClick={async () => { await fetch(`${API_BASE_URL}/api/teacher/events/${event._id}`, {method:'DELETE'}); fetchData(); }} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}