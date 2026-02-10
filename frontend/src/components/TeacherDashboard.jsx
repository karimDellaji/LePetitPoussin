import { useState, useEffect } from 'react';
import { Camera, Check, X, LogOut, Send, Users, Sparkles, Clock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function TeacherDashboard({ teacher, onLogout }) {
  const [eleves, setEleves] = useState([]);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Activité');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  // Charger les élèves
  useEffect(() => {
    fetchEleves();
  }, []);

  const fetchEleves = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/children`);
      if (res.ok) {
        const data = await res.json();
        setEleves(data);
      }
    } catch (err) {
      console.error("Erreur de chargement des élèves:", err);
    }
  };

  const handleAttendance = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handlePostActivity = async (e) => {
    e.preventDefault();
    if (!titre.trim()) {
      alert("Veuillez entrer un titre pour l'activité");
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        titre,
        description,
        type,
        enseignante: teacher.nomComplet,
        section: teacher.section || 'Petite Section',
        approuve: false
      };

      const res = await fetch(`${API_BASE_URL}/api/teacher/events/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (res.ok) {
        alert("Activité envoyée à la direction !");
        setTitre('');
        setDescription('');
      } else {
        const error = await res.json();
        alert("Erreur: " + (error.message || "Problème lors de l'envoi"));
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const submitAttendance = async () => {
    // TODO: Implémenter l'envoi de l'appel au backend
    alert("Appel validé ! (Fonctionnalité à implémenter côté backend)");
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-4 md:p-8 font-sans">
      {/* HEADER TOP */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-emerald-50">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="font-black text-slate-800 uppercase tracking-tighter leading-none text-xl">
              Bonjour, {teacher.nomComplet}
            </h2>
            <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
              {teacher.role}
            </p>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={20}/>
        </button>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SECTION APPEL (GAUCHE) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-emerald-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black uppercase text-slate-800 flex items-center gap-3">
                <Users className="text-emerald-500" size={20}/> Appel du jour
              </h3>
              <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-400 uppercase">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            
            <div className="grid gap-3">
              {eleves.map(e => (
                <div 
                  key={e._id} 
                  className="flex justify-between items-center p-5 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-md transition-all group"
                >
                  <span className="font-black text-slate-700 uppercase text-sm tracking-tight">
                    {e.prenom} {e.nom}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAttendance(e._id, 'present')}
                      className={`p-3 rounded-xl transition-all ${
                        attendance[e._id] === 'present' 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                          : 'bg-white text-slate-300'
                      }`}
                    >
                      <Check size={18}/>
                    </button>
                    <button 
                      onClick={() => handleAttendance(e._id, 'absent')}
                      className={`p-3 rounded-xl transition-all ${
                        attendance[e._id] === 'absent' 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-100' 
                          : 'bg-white text-slate-300'
                      }`}
                    >
                      <X size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={submitAttendance}
              className="w-full mt-8 bg-slate-800 text-white font-black py-5 rounded-[2rem] uppercase text-xs tracking-[0.2em] hover:bg-emerald-600 transition-all"
            >
              Valider l&apos;appel
            </button>
          </div>
        </div>

        {/* SECTION POST ACTIVITÉ (DROITE) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border-t-[12px] border-emerald-500 sticky top-8">
            <h3 className="font-black uppercase text-slate-800 mb-6">Partager un moment</h3>
            <form onSubmit={handlePostActivity} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 block">
                  Type d&apos;événement
                </label>
                <select 
                  className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm appearance-none border border-transparent focus:border-emerald-200"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Activité">Activité Manuelle</option>
                  <option value="Repas">Repas / Goûter</option>
                  <option value="Sieste">Sieste</option>
                  <option value="Sortie">Sortie / Jeux</option>
                  <option value="Photo">Photo</option>
                  <option value="Annonce">Annonce</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 block">
                  Titre
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm border border-transparent focus:border-emerald-200"
                  placeholder="Ex: Peinture à doigts"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 block">
                  Description
                </label>
                <textarea 
                  rows="4"
                  className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm border border-transparent focus:border-emerald-200"
                  placeholder="Ex: Les enfants ont adoré la peinture à doigts aujourd&apos;hui !"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 text-center hover:bg-emerald-50 transition-all cursor-pointer group">
                <Camera className="mx-auto text-slate-300 group-hover:text-emerald-500 transition-colors mb-2" size={32}/>
                <p className="text-[10px] font-black text-slate-400 uppercase group-hover:text-emerald-600">
                  Ajouter une photo (bientôt disponible)
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white font-black py-5 rounded-[2rem] uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                <Send size={16}/> 
                {loading ? 'Envoi...' : "Envoyer à la Direction"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
