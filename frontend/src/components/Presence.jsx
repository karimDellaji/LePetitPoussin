import { useState, useEffect } from 'react';

export default function Presence() {
  const [eleves, setEleves] = useState([]);
  const [presences, setPresences] = useState({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Charger les élèves
      const resKids = await fetch("http://localhost:5000/api/children");
      const kidsData = await resKids.json();
      setEleves(kidsData);

      // 2. Charger les présences du jour
      const resAtt = await fetch(`http://localhost:5000/api/attendance/${today}`);
      const attData = await resAtt.json();
      
      const map = {};
      attData.forEach(p => { map[p.enfant_id] = p.est_present; });
      setPresences(map);
    } catch (err) { console.error("Erreur de chargement"); }
  };

  const togglePresence = async (id) => {
    const nouveauStatut = !presences[id];
    
    // Mise à jour visuelle immédiate
    setPresences(prev => ({ ...prev, [id]: nouveauStatut }));

    try {
      const response = await fetch("http://localhost:5000/api/attendance", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enfant_id: id,
          date_jour: today,
          est_present: nouveauStatut
        })
      });
      if (!response.ok) throw new Error();
    } catch (err) {
      // Si erreur serveur, on annule le changement visuel
      setPresences(prev => ({ ...prev, [id]: !nouveauStatut }));
      alert("Erreur de sauvegarde");
    }
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
      <h2 className="text-xl font-black mb-6">Appel du {today}</h2>
      <div className="space-y-3">
        {eleves.length > 0 ? eleves.map(el => (
          <div key={el._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <span className="font-bold text-gray-700">{el.nom} {el.prenom}</span>
            <button 
              onClick={() => togglePresence(el._id)}
              className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                presences[el._id] ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {presences[el._id] ? 'Présent' : 'Absent'}
            </button>
          </div>
        )) : <p className="text-center text-gray-400 py-10 italic">Aucun élève inscrit.</p>}
      </div>
    </div>
  );
}