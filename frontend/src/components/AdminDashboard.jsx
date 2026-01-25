import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, TrendingDown, Calendar, Camera, 
  LogOut, Printer, Trash2, Edit2, CheckCircle, Phone, X 
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('stats');
  const [eleves, setEleves] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [events, setEvents] = useState([]);
  const [media, setMedia] = useState([]);
  const [staff, setStaff] = useState([]);
  
  const [modals, setModals] = useState({ staff: false, eleve: false, expense: false, event: false });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [filterSection, setFilterSection] = useState('Toutes');

  useEffect(() => { 
    chargerTout();
    const interval = setInterval(chargerTout, 30000);
    return () => clearInterval(interval);
  }, []);

  const chargerTout = () => {
    const api = (p, s) => fetch(`http://localhost:5000/api/${p}`).then(r => r.json()).then(s).catch(e => console.error(e));
    api('children', setEleves); api('expenses', setExpenses); api('events', setEvents); api('staff', setStaff); api('media/admin', setMedia);
  };

  const handleAction = async (path, method, body, modalKey) => {
    await fetch(`http://localhost:5000/api/${path}`, { 
        method, headers: {'Content-Type':'application/json'}, 
        body: body ? JSON.stringify(body) : null 
    });
    if(modalKey) setModals(prev => ({...prev, [modalKey]: false}));
    setIsEditing(false); setSelectedItem(null); setFormData({});
    chargerTout();
  };

  const groupExpensesByMonth = () => {
    const g = {};
    expenses.forEach(e => {
      const m = new Date(e.date).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      if (!g[m]) g[m] = []; g[m].push(e);
    });
    return g;
  };

  const groupMediaBySection = () => {
    const g = {};
    media.forEach(m => {
      const sec = m.classe || m.section || "Autres";
      if (!g[sec]) g[sec] = []; g[sec].push(m);
    });
    return g;
  };

  const imprimerFiche = (e) => {
    const doc = new jsPDF();
    doc.setFontSize(22); doc.setTextColor(16, 185, 129);
    doc.text("PETIT POUSSIN - FICHE ÉLÈVE", 105, 25, { align: 'center' });
    doc.autoTable({
      startY: 40, head: [['Information', 'Détail']],
      body: [['Nom Complet', `${e.prenom} ${e.nom}`], ['Section', e.section], ['Code Parent', e.parentCode], ['Tarif', `${e.tarif} DT`]],
      theme: 'striped', headStyles: {fillColor: [16, 185, 129]}
    });
    doc.save(`Fiche_${e.prenom}.pdf`);
  };

  const pendingMediaCount = media.filter(m => m.status === 'en_attente').length;
  const elevesFiltrés = filterSection === 'Toutes' ? eleves : eleves.filter(e => e.section === filterSection);
  const totalIn = eleves.filter(e => e.paye).reduce((a, b) => a + Number(b.tarif), 0);
  const totalOut = expenses.reduce((a, b) => a + Number(b.montant), 0);

  return (
    <div className="flex min-h-screen bg-[#F4F7F6]">
      <aside className="w-72 bg-white fixed h-full shadow-sm p-6 flex flex-col z-20">
        <div className="mb-10 text-emerald-500 font-black text-xl text-center tracking-tighter uppercase">Petit Poussin</div>
        <nav className="flex-1 space-y-2">
          {[{id:'stats',l:"Vue d'ensemble",i:<LayoutDashboard/>},{id:'eleves',l:'Élèves',i:<Users/>},{id:'staff',l:'Personnel',i:<UserCheck/>},{id:'expenses',l:'Dépenses',i:<TrendingDown/>},{id:'planning',l:'Planning',i:<Calendar/>}, {id:'photos',l:'Médias',i:<Camera/>}].map(m=>(
            <button key={m.id} onClick={()=>setTab(m.id)} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-xs transition-all ${tab===m.id?'bg-emerald-500 text-white shadow-lg':'text-slate-400 hover:bg-emerald-50'}`}>
              <div className="flex items-center gap-4">{m.i} {m.l}</div>
              {m.id === 'photos' && pendingMediaCount > 0 && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse">{pendingMediaCount}</span>}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="pt-6 border-t flex items-center gap-2 text-slate-300 font-bold hover:text-red-500"><LogOut size={16}/> Déconnexion</button>
      </aside>

      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {tab === 'stats' ? "Vue d'ensemble" : tab === 'eleves' ? 'Élèves' : tab === 'staff' ? 'Personnel' : tab === 'photos' ? 'Médias' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </h2>
          <div className="flex gap-3">
             {tab==='eleves' && <button onClick={()=>{setIsEditing(false); setFormData({section: 'Petite Section'}); setModals({...modals, eleve:true})}} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg">+ INSCRIRE</button>}
             {tab==='staff' && <button onClick={()=>{setIsEditing(false); setFormData({classe: 'Petite Section'}); setModals({...modals, staff:true})}} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg">+ PERSONNEL</button>}
             {tab==='planning' && <button onClick={()=>{setIsEditing(false); setModals({...modals, event:true})}} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg">+ ÉVÈNEMENT</button>}
             {tab==='expenses' && <button onClick={()=>setModals({...modals, expense:true})} className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg">+ DÉPENSE</button>}
          </div>
        </header>

        {/* --- STATS & DASHBOARD PLANNING --- */}
        {tab==='stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl col-span-2 flex justify-between items-center">
                    <div><p className="text-[10px] text-slate-500">SOLDE CAISSE</p><p className="text-4xl font-black">{totalIn - totalOut} DT</p></div>
                    <div className="flex gap-6 border-l border-slate-800 pl-6 text-center">
                        <div><p className="text-[9px] text-slate-500 uppercase font-bold">Entrées</p><p className="text-emerald-400 font-bold">+{totalIn}</p></div>
                        <div><p className="text-[9px] text-slate-500 uppercase font-bold">Sorties</p><p className="text-red-400 font-bold">-{totalOut}</p></div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Inscrits</p><p className="text-4xl font-black text-slate-800">{eleves.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm text-center border-b-4 border-emerald-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Présents</p><p className="text-4xl font-black text-emerald-500">{eleves.filter(e=>e.present).length}</p>
                </div>
            </div>
            {/* PLANNING SUR LE DASHBOARD */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm">
                <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 text-xl"><Calendar className="text-emerald-500"/> Prochainement</h3>
                <div className="grid grid-cols-3 gap-6">
                    {events.slice(0,3).map(ev=>(
                        <div key={ev._id} className="p-6 bg-slate-50 rounded-[2rem] border border-white">
                            <div className="bg-white w-10 h-10 rounded-xl shadow-sm text-center flex flex-col justify-center mb-4">
                                <p className="text-lg font-black text-emerald-500">{new Date(ev.date).getDate()}</p>
                            </div>
                            <p className="font-black text-slate-700">{ev.titre}</p><p className="text-xs text-slate-400 mt-1">{ev.description}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* --- ÉLÈVES AVEC UPDATE ICON --- */}
        {tab==='eleves' && (
          <div className="space-y-6">
            <div className="flex gap-3">
                {['Toutes', 'Petite Section', 'Moyenne Section', 'Grande Section'].map(s => (
                    <button key={s} onClick={() => setFilterSection(s)} className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase transition-all ${filterSection === s ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-emerald-50'}`}>{s}</button>
                ))}
            </div>
            <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b">
                        <tr><th className="p-6">Élève & Code Parent</th><th className="p-6">Paiement</th><th className="p-6">Présence</th><th className="p-6 text-right">Actions</th></tr>
                    </thead>
                    <tbody>
                        {elevesFiltrés.map(e => (
                            <tr key={e._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="p-6">
                                    <p className="font-bold text-slate-800">{e.prenom} {e.nom}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-500">{e.parentCode}</span>
                                        <span className="text-[9px] text-emerald-600 font-bold uppercase">{e.section}</span>
                                    </div>
                                </td>
                                <td className="p-6"><button onClick={()=>handleAction(`children/${e._id}/pay`,'PATCH')} className={`px-4 py-2 rounded-xl text-[10px] font-black ${e.paye?'bg-emerald-100 text-emerald-600':'bg-red-50 text-red-500'}`}>{e.paye?'PAYÉ':'À RÉGLER'}</button></td>
                                <td className="p-6"><button onClick={()=>handleAction(`children/${e._id}/presence`,'PATCH')} className={`px-4 py-2 rounded-xl text-[10px] font-black ${e.present?'bg-emerald-500 text-white':'bg-slate-100 text-slate-400'}`}>{e.present?'PRÉSENT':'ABSENT'}</button></td>
                                <td className="p-6 text-right flex justify-end gap-2">
                                    <button onClick={()=>imprimerFiche(e)} className="text-slate-300 hover:text-blue-500 p-2"><Printer size={18}/></button>
                                    <button onClick={()=>{setSelectedItem(e); setFormData(e); setIsEditing(true); setModals({...modals, eleve:true})}} className="text-emerald-500 p-2 hover:bg-emerald-50 rounded-lg"><Edit2 size={18}/></button>
                                    <button onClick={()=>handleAction(`children/${e._id}`,'DELETE')} className="text-slate-200 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* --- PERSONNEL --- */}
        {tab==='staff' && (
            <div className="grid grid-cols-3 gap-6">
                {staff.map(s=>(
                    <div key={s._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm relative">
                        <div className="flex justify-between mb-6">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center font-black">{s.prenom[0]}</div>
                            <div className="flex gap-1">
                                <button onClick={()=>{setSelectedItem(s); setFormData(s); setIsEditing(true); setModals({...modals, staff:true})}} className="text-emerald-400 p-2 hover:bg-emerald-50 rounded-lg"><Edit2 size={18}/></button>
                                <button onClick={()=>handleAction(`staff/${s._id}`,'DELETE')} className="text-slate-200 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                            </div>
                        </div>
                        <p className="font-black text-lg text-slate-800">{s.prenom} {s.nom}</p>
                        <p className="text-emerald-500 font-bold text-[10px] uppercase mb-4">{s.classe}</p>
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg w-fit">Accès: {s.codeAcces}</div>
                    </div>
                ))}
            </div>
        )}

        {/* --- PLANNING --- */}
        {tab==='planning' && (
            <div className="grid grid-cols-2 gap-6">
                {events.map(ev=>(
                    <div key={ev._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm flex justify-between items-center border border-white hover:border-emerald-100 transition-all">
                        <div className="flex gap-6 items-center">
                            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500 text-center font-black min-w-[70px]">
                                <p className="text-2xl">{new Date(ev.date).getDate()}</p>
                                <p className="text-[10px] uppercase">{new Date(ev.date).toLocaleString('fr',{month:'short'})}</p>
                            </div>
                            <div><p className="font-black text-slate-800 text-lg">{ev.titre}</p><p className="text-slate-400 text-sm">{ev.description}</p></div>
                        </div>
                        <button onClick={()=>handleAction(`events/${ev._id}`,'DELETE')} className="text-red-100 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
        )}

        {/* --- MÉDIAS --- */}
        {tab==='photos' && (
            <div className="space-y-10">
                {Object.entries(groupMediaBySection()).map(([section, pics]) => (
                    <div key={section}>
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span> {section}
                        </h3>
                        <div className="grid grid-cols-4 gap-6">
                            {pics.map(m=>(
                                <div key={m._id} className="bg-white p-3 rounded-[2.5rem] shadow-sm group">
                                    <div className="relative overflow-hidden rounded-[2rem] h-40 bg-slate-100">
                                        <img src={m.url} className="w-full h-full object-cover" alt="activity" />
                                        {m.status==='en_attente' && <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-white text-emerald-600 text-[8px] font-black px-3 py-1 rounded-full shadow-lg">EN ATTENTE</span></div>}
                                    </div>
                                    <div className="mt-3 px-2 flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{m.enseignante}</p>
                                        <div className="flex gap-1">
                                            {m.status==='en_attente' && <button onClick={()=>handleAction(`media/${m._id}/approve`,'PATCH')} className="text-emerald-500 p-1 hover:scale-110 transition-transform"><CheckCircle size={16}/></button>}
                                            <button onClick={()=>handleAction(`media/${m._id}`,'DELETE')} className="text-red-200 hover:text-red-500 p-1"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* --- DÉPENSES --- */}
        {tab==='expenses' && (
            <div className="space-y-8">
                {Object.entries(groupExpensesByMonth()).map(([month, items]) => (
                    <div key={month}>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3 ml-4 tracking-widest">{month}</h3>
                        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden">
                            <table className="w-full">
                                {items.map(exp=>(
                                    <tr key={exp._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-6 font-bold text-slate-700">{exp.label}</td>
                                        <td className="p-6 text-red-500 font-black">-{exp.montant} DT</td>
                                        <td className="p-6 text-right"><button onClick={()=>handleAction(`expenses/${exp._id}`,'DELETE')} className="text-slate-200 hover:text-red-500 p-2"><Trash2 size={18}/></button></td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* --- TOUS LES MODALS --- */}
      {modals.eleve && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[3rem] w-full max-w-md relative shadow-2xl">
                <button onClick={()=>{setModals({...modals, eleve:false}); setIsEditing(false)}} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800"><X size={20}/></button>
                <h3 className="text-2xl font-black mb-8 text-slate-800">{isEditing ? "Modifier Élève" : "Nouvel Élève"}</h3>
                <form onSubmit={(e)=>{ 
                    e.preventDefault(); 
                    const finalData = { ...formData, section: formData.section || 'Petite Section' };
                    handleAction(isEditing?`children/${selectedItem._id}`:'children', isEditing?'PUT':'POST', finalData, 'eleve'); 
                }} className="space-y-4">
                    <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Prénom" value={formData.prenom || ''} onChange={e=>setFormData({...formData, prenom:e.target.value})} />
                    <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Nom" value={formData.nom || ''} onChange={e=>setFormData({...formData, nom:e.target.value})} />
                    <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Tarif Mensuel" value={formData.tarif || ''} onChange={e=>setFormData({...formData, tarif:e.target.value})} />
                    <select required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.section || 'Petite Section'} onChange={e=>setFormData({...formData, section:e.target.value})}>
                        <option value="Petite Section">Petite Section</option><option value="Moyenne Section">Moyenne Section</option><option value="Grande Section">Grande Section</option>
                    </select>
                    <button className="w-full bg-emerald-500 text-white p-5 rounded-2xl font-black text-sm uppercase shadow-lg shadow-emerald-100">Enregistrer</button>
                </form>
            </div>
        </div>
      )}

      {modals.staff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[3rem] w-full max-w-md relative shadow-2xl">
                <button onClick={()=>{setModals({...modals, staff:false}); setIsEditing(false)}} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800"><X size={20}/></button>
                <h3 className="text-2xl font-black mb-8 text-slate-800">{isEditing ? "Modifier Personnel" : "Recrutement"}</h3>
                <form onSubmit={(e)=>{ e.preventDefault(); handleAction(isEditing?`staff/${selectedItem._id}`:'staff', isEditing?'PUT':'POST', formData, 'staff'); }} className="space-y-4">
                    <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Prénom" value={formData.prenom || ''} onChange={e=>setFormData({...formData, prenom:e.target.value})} />
                    <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Nom" value={formData.nom || ''} onChange={e=>setFormData({...formData, nom:e.target.value})} />
                    <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Téléphone" value={formData.telephone || ''} onChange={e=>setFormData({...formData, telephone:e.target.value})} />
                    <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold" value={formData.classe || 'Petite Section'} onChange={e=>setFormData({...formData, classe:e.target.value})}>
                        <option value="Petite Section">Petite Section</option><option value="Moyenne Section">Moyenne Section</option><option value="Grande Section">Grande Section</option>
                    </select>
                    <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-sm uppercase">Valider</button>
                </form>
            </div>
        </div>
      )}

      {modals.event && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white p-10 rounded-[3rem] w-full max-w-md relative shadow-2xl">
                  <button onClick={()=>setModals({...modals, event:false})} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800"><X size={20}/></button>
                  <h3 className="text-2xl font-black mb-8 text-slate-800">Évènement</h3>
                  <form onSubmit={(e)=>{ e.preventDefault(); handleAction('events', 'POST', formData, 'event'); }} className="space-y-4">
                      <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Titre" onChange={e=>setFormData({...formData, titre:e.target.value})} />
                      <input required type="date" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" onChange={e=>setFormData({...formData, date:e.target.value})} />
                      <textarea required className="w-full p-4 bg-slate-50 rounded-2xl font-bold h-24" placeholder="Description" onChange={e=>setFormData({...formData, description:e.target.value})} />
                      <button className="w-full bg-emerald-500 text-white p-5 rounded-2xl font-black text-sm uppercase">Publier</button>
                  </form>
              </div>
          </div>
      )}

      {modals.expense && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white p-10 rounded-[3rem] w-full max-w-md relative shadow-2xl">
                  <button onClick={()=>setModals({...modals, expense:false})} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800"><X size={20}/></button>
                  <h3 className="text-2xl font-black mb-8 text-slate-800">Dépense</h3>
                  <form onSubmit={(e)=>{ e.preventDefault(); handleAction('expenses', 'POST', formData, 'expense'); }} className="space-y-4">
                      <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Libellé" onChange={e=>setFormData({...formData, label:e.target.value})} />
                      <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" placeholder="Montant (DT)" onChange={e=>setFormData({...formData, montant:e.target.value})} />
                      <button className="w-full bg-red-500 text-white p-5 rounded-2xl font-black text-sm uppercase">Ajouter</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}