import React, { useState, useEffect } from 'react';
import { Camera, LogOut, Calendar, UserCheck, Image as ImageIcon, Send, Info } from 'lucide-react';

export default function TeacherSpace({ user, onLogout }) {
    const [eleves, setEleves] = useState([]);
    const [events, setEvents] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    // Sécurité : Extraire les données que le serveur envoie (souvent dans user.info ou user directement)
    const enseignanteInfo = user.info || user; 

    useEffect(() => {
        chargerDonnees();
    }, [enseignanteInfo.classe]);

    const chargerDonnees = async () => {
        try {
            const resEleves = await fetch('http://localhost:5000/api/children');
            const dataEleves = await resEleves.json();
            // CORRECTION : Filtrage strict sur la classe de l'enseignante
            const mesEleves = dataEleves.filter(e => e.section === enseignanteInfo.classe);
            setEleves(mesEleves);

            const resEvents = await fetch('http://localhost:5000/api/events');
            const dataEvents = await resEvents.json();
            setEvents(dataEvents);
        } catch (err) {
            console.error("Erreur chargement:", err);
        }
    };

    const togglePresence = async (id) => {
        await fetch(`http://localhost:5000/api/children/${id}/presence`, { method: 'PATCH' });
        chargerDonnees(); // Rafraîchir la liste
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', image);
        // CORRECTION : On envoie le prénom de l'enseignante récupéré du profil
        formData.append('enseignante', enseignanteInfo.prenom); 
        formData.append('classe', enseignanteInfo.classe);

        try {
            await fetch('http://localhost:5000/api/media/upload', { method: 'POST', body: formData });
            setMsg("✅ Photo envoyée !");
            setImage(null);
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("❌ Erreur d'envoi");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F4F7F6] p-6 pb-24">
            {/* Header corrigé pour afficher le prénom */}
            <header className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Bonjour, {enseignanteInfo.prenom} 👋
                    </h2>
                    <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">
                        Gestion de la {enseignanteInfo.classe}
                    </p>
                </div>
                <button onClick={onLogout} className="bg-slate-50 text-slate-400 p-4 rounded-2xl hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Liste d'appel enfin visible */}
                <section className="bg-white p-8 rounded-[3rem] shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <UserCheck className="text-emerald-500" /> Appel du jour
                    </h3>
                    <div className="space-y-3">
                        {eleves.length > 0 ? eleves.map(e => (
                            <div key={e._id} className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.8rem] border border-transparent hover:border-emerald-100 transition-all">
                                <div>
                                    <p className="font-bold text-slate-700">{e.prenom} {e.nom}</p>
                                    {e.observations && <p className="text-[10px] text-amber-500 font-bold uppercase italic"><Info size={10} className="inline mr-1"/> {e.observations}</p>}
                                </div>
                                <button 
                                    onClick={() => togglePresence(e._id)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all ${e.present ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-300 border border-slate-200'}`}
                                >
                                    {e.present ? 'PRÉSENT' : 'ABSENT'}
                                </button>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 py-10 font-bold italic">Aucun élève trouvé pour votre section.</p>
                        )}
                    </div>
                </section>

                <div className="space-y-8">
                    {/* Upload avec nom enseignante */}
                    <section className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Camera className="text-emerald-400" /> Moments de classe</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={(e) => setImage(e.target.files[0])}/>
                            <label htmlFor="photo-upload" className="block border-2 border-dashed border-slate-700 rounded-3xl p-10 text-center cursor-pointer hover:border-emerald-500 transition-all bg-slate-800/50">
                                <ImageIcon className="mx-auto mb-3 text-slate-500" size={32} />
                                <p className="text-xs font-bold text-slate-400">{image ? image.name : "Cliquez ici pour prendre une photo"}</p>
                            </label>
                            <button disabled={!image || loading} className={`w-full py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 ${!image || loading ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'}`}>
                                {loading ? "Envoi..." : <><Send size={16}/> Envoyer pour approbation</>}
                            </button>
                            {msg && <p className="text-center text-xs font-bold text-emerald-400 animate-pulse">{msg}</p>}
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}