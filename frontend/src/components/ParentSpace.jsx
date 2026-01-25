import React, { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon, CheckCircle2, LogOut } from 'lucide-react';

const API_BASE_URL = "https://le-petit-poussin-api.onrender.com";

export default function ParentDashboard({ user, onLogout }) {
  const [media, setMedia] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mRes, eRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/media/admin`),
          fetch(`${API_BASE_URL}/api/events`)
        ]);
        const mData = await mRes.json();
        const eData = await eRes.json();
        // On ne montre que les photos approuvées de SA section
        setMedia(mData.filter(m => m.status === 'approuve' && (m.classe === user.section || m.section === user.section)));
        setEvents(eData);
      } catch (err) { console.error(err); }
    };
    fetchAll();
  }, [user.section]);

  return (
    <div className="min-h-screen bg-[#F4F7F6] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bonjour, {user.prenom} !</h2>
            <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">{user.section}</p>
          </div>
          <button onClick={onLogout} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 transition-colors"><LogOut size={20}/></button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* STATUT PAIEMENT */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-4 border-emerald-500">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Statut de Frais</h3>
            <div className="flex items-center gap-3">
              {user.paye ? (
                <><CheckCircle2 className="text-emerald-500" size={24}/> <span className="font-bold text-slate-800">Règlement à jour</span></>
              ) : (
                <><div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"/> <span className="font-bold text-red-500">Paiement en attente</span></>
              )}
            </div>
          </div>

          {/* PROCHAIN ÉVÈNEMENT */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white md:col-span-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Agenda de l'école</h3>
            {events.length > 0 ? (
              <div className="flex gap-6 items-center">
                <div className="bg-emerald-500 p-3 rounded-2xl font-black text-center min-w-[60px]">
                  <p className="text-xl">{new Date(events[0].date).getDate()}</p>
                  <p className="text-[9px] uppercase">{new Date(events[0].date).toLocaleString('fr',{month:'short'})}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{events[0].titre}</p>
                  <p className="text-slate-400 text-xs">{events[0].description}</p>
                </div>
              </div>
            ) : <p className="text-slate-500">Aucun évènement prévu</p>}
          </div>
        </div>

        {/* GALLERIE PHOTOS */}
        <div className="mt-12">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <ImageIcon className="text-emerald-500"/> Moments de vie
          </h3>
          {media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.map(m => (
                <div key={m._id} className="aspect-square bg-white p-2 rounded-[2rem] shadow-sm">
                  <img src={m.url} className="w-full h-full object-cover rounded-[1.5rem]" alt="école" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[3rem] text-center text-slate-400 italic shadow-sm">
              Les photos de la semaine arriveront bientôt !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}