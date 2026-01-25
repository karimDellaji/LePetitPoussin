import { useState, useEffect } from 'react';
import { UserPlus, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';

export default function Eleves() {
  const [eleves, setEleves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ nom: '', prenom: '', section: 'Petite Section', tarif: '' });

  useEffect(() => { fetchEleves(); }, []);

  const fetchEleves = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/children");
      const data = await res.json();
      setEleves(data);
    } catch (err) { console.error("Erreur de chargement:", err); }
  };

  const ajouterEleve = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/children", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ nom: '', prenom: '', section: 'Petite Section', tarif: '' });
      fetchEleves();
    } catch (err) { console.error("Erreur ajout:", err); }
  };

  // --- LA FONCTION CORRIGÉE POUR L'ERREUR 404 ---
  const togglePaiement = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/children/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paye: !currentStatus })
      });

      if (res.status === 404) {
        alert("Oups ! Cet élève semble avoir été supprimé ou l'ID est invalide. Actualisation de la liste...");
        fetchEleves();
        return;
      }

      if (res.ok) {
        fetchEleves(); // Recharge pour mettre à jour le bouton et le Dashboard
      }
    } catch (err) {
      console.error("Erreur réseau lors du paiement:", err);
    }
  };

  const supprimerEleve = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet élève ?")) {
      await fetch(`http://localhost:5000/api/children/${id}`, { method: 'DELETE' });
      fetchEleves();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION FORMULAIRE */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
          <UserPlus className="text-primary" size={20}/> Inscription
        </h2>
        <form onSubmit={ajouterEleve} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="bg-gray-50 p-4 rounded-2xl border-none outline-none text-sm" placeholder="Nom" value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} required />
          <input className="bg-gray-50 p-4 rounded-2xl border-none outline-none text-sm" placeholder="Prénom" value={form.prenom} onChange={e=>setForm({...form, prenom:e.target.value})} required />
          <select className="bg-gray-50 p-4 rounded-2xl border-none font-bold text-xs" value={form.section} onChange={e=>setForm({...form, section:e.target.value})}>
            <option>Petite Section</option>
            <option>Moyenne Section</option>
            <option>Grande Section</option>
          </select>
          <input className="bg-gray-50 p-4 rounded-2xl border-none outline-none text-sm" type="number" placeholder="Tarif (DT)" value={form.tarif} onChange={e=>setForm({...form, tarif:e.target.value})} required />
          <button type="submit" className="md:col-span-4 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-primary/10">
            Enregistrer l'inscription
          </button>
        </form>
      </div>

      {/* SECTION TABLEAU */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input className="pl-10 pr-4 py-2 bg-white rounded-xl border-none text-[10px] w-full shadow-inner" placeholder="Rechercher..." onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Enfant</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Section</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Statut</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Tarif</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {eleves.filter(el => `${el.nom} ${el.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())).map(el => (
                <tr key={el._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <p className="font-black text-gray-800 text-sm">{el.nom} {el.prenom}</p>
                    <p className="text-[10px] font-bold text-primary">ID: {el.parentCode}</p>
                  </td>
                  <td className="p-6 text-[10px] font-black text-gray-400 uppercase">{el.section}</td>
                  <td className="p-6">
                    <button 
                      onClick={() => togglePaiement(el._id, el.paye)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all active:scale-90 ${
                        el.paye ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-red-500 text-white shadow-lg shadow-red-200'
                      }`}
                    >
                      {el.paye ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                      {el.paye ? "Payé" : "Non Payé"}
                    </button>
                  </td>
                  <td className="p-6 font-black text-gray-800 text-sm">{el.tarif} DT</td>
                  <td className="p-6">
                    <button onClick={() => supprimerEleve(el._id)} className="text-gray-200 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
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