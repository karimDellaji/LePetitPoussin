import { useState, useEffect } from 'react';
import { 
  Heart, Calendar, LogOut, Camera, 
  MapPin, Clock, Star, CheckCircle2, AlertCircle, Phone
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ParentDashboard({ child, onLogout }) {
  const [journal, setJournal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [child.section]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // CORRIGÉ: Utilise la bonne route API
      const res = await fetch(`${API_BASE_URL}/api/teacher/events/approved/${child.section}`);
      if (res.ok) {
        const data = await res.json();
        setJournal(data);
      }
    } catch (err) {
      console.error("Erreur de chargement des activités:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] font-sans pb-20">
      {/* HEADER : PROFIL ENFANT */}
      <header className="bg-white border-b border-slate-50 px-6 py-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-emerald-100 border-4 border-white">
              {child.prenom?.[0] || '?'}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                {child.prenom} <span className="text-emerald-500">{child.nom}</span>
              </h1>
              <div className="flex gap-3 mt-1">
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {child.section}
                </span>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Star size={10} fill="currentColor"/> Actif
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={22}/>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        
        {/* ALERTE PAIEMENT */}
        {!child.estPaye ? (
          <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[3rem] flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-5">
              <div className="bg-red-500 p-4 rounded-2xl text-white">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-black text-red-600 uppercase text-sm">Paiement en attente</h4>
                <p className="text-red-400 font-bold text-xs mt-1">La scolarité de ce mois n&apos;a pas encore été régularisée.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-black text-xl">{child.tarif} DT</p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-[3rem] flex items-center gap-4 text-emerald-600">
            <CheckCircle2 size={24} />
            <p className="font-black uppercase text-xs tracking-widest">Scolarité à jour. Merci !</p>
          </div>
        )}

        {/* JOURNAL DE BORD (FIL D'ACTUALITÉ) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 uppercase text-lg flex items-center gap-3">
              <Heart className="text-emerald-500" fill="currentColor" size={22}/> 
              Moments magiques
            </h3>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
              Aujourd&apos;hui
            </span>
          </div>

          {loading ? (
            <div className="bg-white border-4 border-dashed border-slate-50 p-20 rounded-[4rem] text-center">
              <p className="text-slate-300 font-black uppercase text-sm tracking-widest">
                Chargement...
              </p>
            </div>
          ) : journal.length === 0 ? (
            <div className="bg-white border-4 border-dashed border-slate-50 p-20 rounded-[4rem] text-center">
              <Camera size={48} className="mx-auto text-slate-100 mb-6" />
              <p className="text-slate-300 font-black uppercase text-sm tracking-widest">
                L&apos;enseignante n&apos;a pas encore posté de photos.
              </p>
            </div>
          ) : (
            <div className="grid gap-10">
              {journal.map(post => (
                <div 
                  key={post._id} 
                  className="bg-white rounded-[4rem] shadow-2xl shadow-slate-100 overflow-hidden border border-slate-50 transform hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Image si elle existe */}
                  {post.mediaUrl ? (
                    <img 
                      src={`${API_BASE_URL}${post.mediaUrl}`} 
                      className="w-full h-80 object-cover" 
                      alt="activité"
                    />
                  ) : (
                    <div className="w-full h-4 bg-emerald-500" />
                  )}
                  
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {post.type}
                      </span>
                      <div className="flex items-center gap-2 text-slate-300 font-bold text-[10px] uppercase">
                        <Clock size={12}/> 
                        {new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4 leading-tight">
                      {post.titre}
                    </h4>
                    {post.description && (
                      <p className="text-slate-500 text-sm mb-4">{post.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-[10px] font-black uppercase">
                        {post.enseignante?.[0] || '?'}
                      </div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                        Posté par Mme. {post.enseignante}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER INFOS JARDIN */}
      <footer className="max-w-4xl mx-auto px-6 mt-10">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-500 p-4 rounded-2xl">
                <MapPin size={24}/>
             </div>
             <p className="font-black uppercase text-xs leading-loose tracking-widest">
                Votre enfant est en sécurité<br/>
                <span className="text-emerald-400">Le Petit Poussin</span>
             </p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all">
                <Phone size={20}/>
             </button>
             <button className="bg-emerald-500 p-4 rounded-2xl hover:scale-110 transition-all">
                <Calendar size={20}/>
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
