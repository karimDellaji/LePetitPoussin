import React, { useState, useEffect } from 'react';
import { LogOut, Camera, Calendar, Receipt, Download, Heart } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ParentSpace({ user, onLogout }) {
    const [photos, setPhotos] = useState([]);
    const [events, setEvents] = useState([]);
    const child = user?.info || user;

    useEffect(() => {
        if (child?.section) {
            fetch('http://localhost:5000/api/media/admin').then(r => r.json()).then(data => {
                setPhotos(data.filter(m => m.status === 'approuve' && m.classe === child.section));
            });
            fetch('http://localhost:5000/api/events').then(r => r.json()).then(setEvents);
        }
    }, [child]);

    const downloadPhoto = async (url, id) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `PetitPoussin_${id}.jpg`;
        link.click();
    };

    if (!child?.prenom) return <div className="p-20 text-center font-black">Chargement...</div>;

    return (
        <div className="min-h-screen bg-[#F4F7F6] p-6 pb-24">
            <header className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm mb-10 border border-emerald-50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-black text-xl">{child.prenom.charAt(0)}</div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800">{child.prenom} {child.nom}</h2>
                        <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">{child.section}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="bg-slate-50 p-4 rounded-2xl text-slate-300 hover:text-red-500"><LogOut size={20}/></button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-8">
                    <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-emerald-400"><Receipt size={20}/> Finance</h3>
                        <div className={`p-6 rounded-3xl mb-6 ${child.paye ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            <p className="text-2xl font-black">{child.paye ? 'RÉGLÉ ✅' : 'NON RÉGLÉ ❌'}</p>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-2">
                    <section className="bg-white p-10 rounded-[3rem] shadow-sm min-h-[500px]">
                        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3"><Camera size={28} className="text-emerald-500"/> Galerie Photos</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {photos.length > 0 ? photos.map(p => (
                                <div key={p._id} className="group relative rounded-[2rem] overflow-hidden shadow-sm bg-slate-50">
                                    <img src={p.url} alt="classe" className="w-full h-72 object-cover"/>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <button onClick={() => downloadPhoto(p.url, p._id)} className="bg-white text-emerald-500 p-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"><Download size={16}/> TÉLÉCHARGER</button>
                                    </div>
                                </div>
                            )) : <p className="text-slate-300 italic font-bold">Aucune photo pour le moment.</p>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}