import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, LogOut, Camera, Send, CheckCircle2 } from 'lucide-react';

export default function DashboardTeacher({ auth, onLogout }) {
  const [eleves, setEleves] = useState([]);
  const [presences, setPresences] = useState({});
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const resEleves = await fetch("http://localhost:5000/api/children");
    const dataEleves = await resEleves.json();
    setEleves(dataEleves);

    const resPres = await fetch("http://localhost:5000/api/attendance/today");
    const dataPres = await resPres.json();
    const mapPres = {};
    dataPres.forEach(p => mapPres[p.enfant_id] = p.est_present);
    setPresences(mapPres);
  };

  const togglePresence = async (id) => {
    const nouveauStatut = !presences[id];
    setPresences({ ...presences, [id]: nouveauStatut });
    await fetch("http://localhost:5000/api/attendance", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enfant_id: id, est_present: nouveauStatut })
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('titre', titre || "Activité");
    formData.append('section', "Toutes");
    const res = await fetch("http://localhost:5000/api/posts", { method: 'POST', body: formData });
    if (res.ok) {
      setMessage("Envoyé !");
      setFile(null); setTitre("");
      setTimeout(() => setMessage(""), 3000);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-orange-50/30 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Humain */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100">
          <div>
            <h1 className="text-xl font-black text-orange-700 tracking-tight">Bonjour, {auth.name} ! 👋</h1>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest italic">Espace Enseignante • Le Petit Poussin</p>
          </div>
          <button onClick={onLogout} className="bg-red-50 text-red-500 px-5 py-2 rounded-2xl font-bold text-xs flex items-center gap-2">
            <LogOut size={16} /> DÉCONNEXION
          </button>
        </div>

        {/* Section Photo */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-8 border border-orange-100">
          <h2 className="text-lg font-black mb-6 flex items-center gap-2 text-slate-700">📸 PARTAGER UN MOMENT</h2>
          {message && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold">{message}</div>}
          <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4">
            <input className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium" placeholder="Titre de l'activité..." value={titre} onChange={(e) => setTitre(e.target.value)} />
            <input type="file" accept="image/*" className="text-xs self-center" onChange={(e) => setFile(e.target.files[0])} />
            <button className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase">{uploading ? "..." : "ENVOYER"}</button>
          </form>
        </div>

        {/* Section Appel */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-100 overflow-hidden">
          <div className="p-8 border-b border-orange-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-700 uppercase">📝 Appel du jour</h2>
            <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-xs font-black">
                {Object.values(presences).filter(v => v).length} / {eleves.length}
            </span>
          </div>
          <div className="divide-y divide-orange-50">
            {eleves.map(eleve => (
              <div key={eleve._id} className="p-6 flex justify-between items-center">
                <span className="font-bold text-gray-800">{eleve.prenom} {eleve.nom}</span>
                <button onClick={() => togglePresence(eleve._id)} className={`px-6 py-3 rounded-2xl font-black text-[10px] transition-all ${presences[eleve._id] ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {presences[eleve._id] ? "PRÉSENT ✅" : "ABSENT ❌"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}