import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Depenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ titre: '', montant: '', description: '', categorie: 'Autre' });

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/expenses`);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Erreur de chargement des dépenses:", err);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!form.montant || !form.titre) return;
    
    try {
      await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ titre: '', montant: '', description: '', categorie: 'Autre' });
      fetchExpenses();
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Supprimer cette dépense ?")) {
      try {
        await fetch(`${API_BASE_URL}/api/expenses/${id}`, { method: 'DELETE' });
        fetchExpenses();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };

  const total = expenses.reduce((acc, curr) => acc + (curr.montant || 0), 0);

  return (
    <div className="space-y-8 font-sans">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <CreditCard className="text-emerald-500"/> Nouvelle Dépense
        </h2>
        <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            className="bg-gray-50 p-4 rounded-2xl border-none text-sm" 
            placeholder="Titre (ex: Facture STEG)" 
            value={form.titre} 
            onChange={e => setForm({...form, titre: e.target.value})} 
            required 
          />
          <input 
            className="bg-gray-50 p-4 rounded-2xl border-none text-sm" 
            type="number" 
            placeholder="Montant DT" 
            value={form.montant} 
            onChange={e => setForm({...form, montant: e.target.value})} 
            required 
          />
          <select 
            className="bg-gray-50 p-4 rounded-2xl border-none text-sm"
            value={form.categorie}
            onChange={e => setForm({...form, categorie: e.target.value})}
          >
            <option value="Autre">Catégorie...</option>
            <option value="Facture">Facture</option>
            <option value="Salaire">Salaire</option>
            <option value="Loyer">Loyer</option>
            <option value="Matériel">Matériel</option>
            <option value="Nourriture">Nourriture</option>
          </select>
          <button 
            className="bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all"
          >
            <Plus size={14}/> Ajouter la dépense
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Historique des sorties</h3>
            <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Dépenses</p>
                <p className="text-2xl font-black text-red-500">{total} DT</p>
            </div>
        </div>
        <div className="divide-y divide-gray-50">
          {expenses.map(exp => (
            <div key={exp._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
                    <Calendar size={18}/>
                </div>
                <div>
                    <p className="font-bold text-gray-800">{exp.titre}</p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      {new Date(exp.date_depense || exp.createdAt).toLocaleDateString()}
                    </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-black text-gray-800">{exp.montant} DT</p>
                <button 
                  onClick={() => deleteExpense(exp._id)} 
                  className="text-gray-200 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={18}/>
                </button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="p-10 text-center text-gray-400 italic">Aucune dépense enregistrée ce mois-ci.</p>
          )}
        </div>
      </div>
    </div>
  );
}
