import { useState, useEffect } from 'react';
import { UserPlus, Trash2, CheckCircle, XCircle, Search, GraduationCap } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Eleves({ onUpdate }) {
  const [eleves, setEleves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ 
    nom: '', 
    prenom: '', 
    section: 'Petite Section', 
    tarif: '',
    parentTel: ''
  });

  useEffect(() => { fetchEleves(); }, []);

  const fetchEleves = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/children`);
      const data = await res.json();
      setEleves(data);
    } catch (err) { 
      console.error("Erreur de chargement:", err); 
    }
  };

  const ajouterEleve = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/children`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ nom: '', prenom: '', section: 'Petite Section', tarif: '', parentTel: '' });
        fetchEleves();
        if (onUpdate) onUpdate(); // Mise à jour du solde car nouvel élève = nouveau revenu potentiel
      }
    } catch (err) { 
      console.error("Erreur ajout:", err); 
    }
  };

  const togglePaiement = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/children/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estPaye: !currentStatus })
      });

      if (res.status === 404) {
        alert("Oups ! Cet élève semble avoir été supprimé.");
        fetchEleves();
        return;
      }

      if (res.ok) {
        fetchEleves();
        if (onUpdate) onUpdate(); // DÉCLENCHE LA MISE À JOUR DU SOLDE AUTOMATIQUEMENT
      }
    } catch (err) {
      console.error("Erreur réseau lors du paiement:", err);
    }
  };

  const supprimerEleve = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet élève ?")) {
      const res = await fetch(`${API_BASE_URL}/api/children/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEleves();
        if (onUpdate) onUpdate(); // Mise à jour du solde après suppression
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION FORMULAIRE D'INSCRIPTION */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tighter text-slate-800">
          <UserPlus className="text-emerald-500" size={20}/> Inscription des Éléves
        </h2>
        <form onSubmit={ajouterEleve} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input 
            className="bg-gray-50 p-4 rounded-2xl border-none outline-none text-sm font-bold" 
            placeholder="Nom" 
            value={form.nom} 
            onChange={e => setForm({...form, nom: e.target.value})} 
            required 
          />
          <input 
            className="bg-gray-50 p-4 rounded-2xl border-none outline-none text-sm font-bold" 
            placeholder="Prénom" 
            value={form.prenom} 
            onChange={e => setForm({...form, prenom: e.target.value})} 
            required 
          />
          <select 
            className="bg-gray-50 p-4 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest" 
            value={form.section} 
            onChange={e => setForm({...form, section: e.target.value})}
          >
            <option>Petite Section</option>
            <option>Moyenne Section</option>
            <option>Grande Section</option>
          </select>
          <input 
            className="bg-gray-50 p-4 rounded-2xl border-none outline-none text-sm font-bold" 
            type="number" 
            placeholder="Tarif (DT)" 
            value={form.tarif} 
            onChange={e => setForm({...form, tarif: e.target.value})} 
            required 
          />
          <input 
            className="bg-gray-50 p-4 rounded-2xl border-none outline-none text-sm font-bold" 
            placeholder="Tél Parent" 
            value={form.parentTel} 
            onChange={e => setForm({...form, parentTel: e.target.value})} 
            required 
          />
          <button 
            type="submit" 
            className="md:col-span-5 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-100"
          >
            Enregistrer l'inscription
          </button>
        </form>
      </div>

      {/* SECTION TABLEAU DES ÉLÈVES */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <GraduationCap size={16} className="text-emerald-500"/> Liste des Éléves
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input 
              className="pl-10 pr-4 py-2 bg-white rounded-xl border-none text-[10px] w-full shadow-inner font-bold" 
              placeholder="Rechercher un enfant..." 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Enfant</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Section</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Statut Paiement</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Tarif</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {eleves
                .filter(el => `${el.nom} ${el.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(el => (
                <tr key={el._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <p className="font-black text-slate-800 text-sm uppercase">{el.nom} {el.prenom}</p>
                    <p className="text-[9px] font-black text-emerald-500 tracking-tighter">CODE PARENT: {el.parentCode}</p>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                      {el.section}
                    </span>
                  </td>
                  <td className="p-6">
                    <button 
                      onClick={() => togglePaiement(el._id, el.estPaye)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all active:scale-95 ${
                        el.estPaye 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                          : 'bg-red-500 text-white shadow-lg shadow-red-100'
                      }`}
                    >
                      {el.estPaye ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                      {el.estPaye ? "Scolarité Payée" : "Non Payé"}
                    </button>
                  </td>
                  <td className="p-6 font-black text-slate-800 text-sm">{el.tarif} DT</td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => supprimerEleve(el._id)} 
                      className="p-3 bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}