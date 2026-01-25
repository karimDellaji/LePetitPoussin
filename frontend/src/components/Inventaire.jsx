import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Minus } from 'lucide-react';

export default function Inventaire() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ article: '', quantite: 0, alerte: 5 });
  const API_URL = "http://localhost:5000/api/inventory";

  useEffect(() => { fetchInv(); }, []);
  async function fetchInv() { const res = await fetch(API_URL); setItems(await res.json()); }

  const addArticle = async (e) => {
    e.preventDefault();
    await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ article: '', quantite: 0, alerte: 5 });
    fetchInv();
  };

  const updateQty = async (id, newQty) => {
    await fetch(`${API_URL}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantite: newQty }) });
    fetchInv();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="font-black mb-6 flex items-center gap-2"><Package className="text-primary"/> Nouvel Article</h2>
        <form onSubmit={addArticle} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="bg-gray-50 p-4 rounded-2xl border-none text-sm" placeholder="Nom (ex: Couches Size 4)" value={form.article} onChange={e=>setForm({...form, article: e.target.value})} required />
          <input className="bg-gray-50 p-4 rounded-2xl border-none text-sm" type="number" placeholder="Quantité" value={form.quantite} onChange={e=>setForm({...form, quantite: e.target.value})} />
          <input className="bg-gray-50 p-4 rounded-2xl border-none text-sm" type="number" placeholder="Seuil d'alerte" value={form.alerte} onChange={e=>setForm({...form, alerte: e.target.value})} />
          <button className="bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase">Ajouter au stock</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item._id} className={`p-6 rounded-[2rem] border bg-white ${item.quantite <= item.alerte ? 'border-secondary/30 ring-4 ring-secondary/5' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-800">{item.article}</h3>
              {item.quantite <= item.alerte && <AlertTriangle className="text-secondary" size={20}/>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black">{item.quantite}</span>
              <div className="flex gap-2">
                <button onClick={() => updateQty(item._id, item.quantite - 1)} className="p-2 bg-gray-100 rounded-lg"><Minus size={16}/></button>
                <button onClick={() => updateQty(item._id, item.quantite + 1)} className="p-2 bg-primary text-white rounded-lg"><Plus size={16}/></button>
              </div>
            </div>
            {item.quantite <= item.alerte && <p className="text-[10px] text-secondary font-black uppercase mt-4">Stock critique !</p>}
          </div>
        ))}
      </div>
    </div>
  );
}