import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Paiements() {
  const [eleves, setEleves] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [selectedEnfant, setSelectedEnfant] = useState('');
  const [montant, setMontant] = useState('');
  const [mois, setMois] = useState('Janvier 2026');

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    // Récupérer les élèves pour le menu déroulant
    const { data: kids } = await supabase.from('children').select('id, nom, prenom');
    setEleves(kids || []);

    // Récupérer l'historique des paiements
    const { data: pays } = await supabase
      .from('payments')
      .select('*, children(nom, prenom)')
      .order('date_paiement', { ascending: false });
    setPaiements(pays || []);
  }

  const enregistrerPaiement = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('payments')
      .insert([{ 
        enfant_id: selectedEnfant, 
        montant: montant, 
        mois_concerne: mois, 
        statut: 'payé' 
      }])
      .select('*, children(nom, prenom)');

    if (error) alert(error.message);
    else {
      setPaiements([data[0], ...paiements]);
      setMontant('');
      alert("Paiement enregistré avec succès !");
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de Paiement */}
      <form onSubmit={enregistrerPaiement} className="bg-white p-6 rounded-xl shadow-sm border flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enfant</label>
          <select 
            className="w-full p-2 border rounded-lg"
            value={selectedEnfant}
            onChange={(e) => setSelectedEnfant(e.target.value)}
            required
          >
            <option value="">Sélectionner un enfant...</option>
            {eleves.map(e => (
              <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (TND)</label>
          <input 
            type="number" className="w-full p-2 border rounded-lg" 
            value={montant} onChange={(e) => setMontant(e.target.value)} required 
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
          <input 
            type="text" className="w-full p-2 border rounded-lg" 
            value={mois} onChange={(e) => setMois(e.target.value)} 
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
          <CreditCard size={18} /> Valider le Paiement
        </button>
      </form>

      {/* Historique */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Enfant</th>
              <th className="p-4 font-semibold text-gray-600">Mois</th>
              <th className="p-4 font-semibold text-gray-600">Montant</th>
              <th className="p-4 font-semibold text-gray-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-4 font-medium">{p.children?.nom} {p.children?.prenom}</td>
                <td className="p-4 text-gray-600">{p.mois_concerne}</td>
                <td className="p-4 font-bold">{p.montant} TND</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold w-fit">
                    <CheckCircle size={14} /> {p.statut.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}