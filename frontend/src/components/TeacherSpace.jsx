import React, { useState, useEffect } from 'react';
import { Camera, Check, UploadCloud, LogOut } from 'lucide-react';

const API_BASE_URL = "https://le-petit-poussin-api.onrender.com";

export default function TeacherDashboard({ user, onLogout }) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('enseignante', `${user.prenom} ${user.nom}`);
    formData.append('classe', user.classe);

    try {
      const res = await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert("Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="bg-emerald-500 p-8 text-white text-center">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Espace Enseignante</p>
          <h2 className="text-2xl font-black mt-2">{user.prenom} {user.nom}</h2>
          <span className="inline-block mt-2 bg-white/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
            {user.classe}
          </span>
        </div>

        <div className="p-10 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800">Partager un moment</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">Prenez une photo de l'activité pour les parents</p>
          </div>

          <label className={`relative flex flex-col items-center justify-center w-full h-40 border-4 border-dashed rounded-[2rem] transition-all cursor-pointer ${success ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-300'}`}>
            {uploading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
            ) : success ? (
              <Check size={48} className="text-emerald-500 animate-bounce" />
            ) : (
              <>
                <UploadCloud size={40} className="text-slate-300 mb-2" />
                <span className="text-xs font-black text-slate-400 uppercase">Cliquez pour envoyer</span>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>

        <button onClick={onLogout} className="w-full p-6 text-slate-300 font-bold text-xs uppercase hover:text-red-500 transition-colors border-t border-slate-50 flex items-center justify-center gap-2">
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </div>
  );
}