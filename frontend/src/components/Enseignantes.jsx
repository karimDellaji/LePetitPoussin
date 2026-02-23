import { useState, useEffect } from 'react';
import { Trash2, ShieldCheck, Mail, Phone, BookOpen, GraduationCap } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Enseignantes() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/staff`);
      const data = await res.json();
      // Filtrer pour ne montrer que les enseignantes si nécessaire, 
      // ou afficher tout le personnel
      setTeachers(data);
    } catch (err) {
      console.error("Erreur chargement personnel:", err);
    }
  };

  const deleteTeacher = async (id) => {
    if (window.confirm("Supprimer cet accès ?")) {
      await fetch(`${API_BASE_URL}/api/staff/${id}`, { method: 'DELETE' });
      fetchTeachers();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.length > 0 ? teachers.map(t => (
          <div key={t._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:bg-emerald-500/10" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-lg shadow-slate-200 uppercase">
                {t.nomComplet[0]}
              </div>
              
              <h4 className="font-black text-slate-800 uppercase text-sm mb-1 tracking-tighter">
                {t.nomComplet}
              </h4>
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck size={10} /> {t.role || t.section}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                  <Mail size={14} className="text-emerald-500" /> {t.email || "Non renseigné"}
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                  <BookOpen size={14} className="text-emerald-500" /> {t.section || "Toutes sections"}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  ID: {t.loginCode || 'EMAIL ACCESS'}
                </p>
                <button 
                  onClick={() => deleteTeacher(t._id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <GraduationCap size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              Aucune enseignante enregistrée
            </p>
          </div>
        )}
      </div>
    </div>
  );
}