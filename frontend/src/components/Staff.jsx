import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Banknote, Briefcase, Phone, Check, CreditCard } from 'lucide-react';

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState('Enseignante');
  const [classe, setClasse] = useState('Petite Section');
  const [salaire, setSalaire] = useState('');
  const [telephone, setTelephone] = useState('');
  
  const API_URL = "http://localhost:5000/api";

  useEffect(() => { fetchStaff(); }, []);

  async function fetchStaff() {
    const res = await fetch(`${API_URL}/staff`);
    const data = await res.json();
    setStaffList(data || []);
  }

  const addStaff = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, role, classe, salaire, telephone })
    });
    setNom(''); setPrenom(''); setSalaire(''); setTelephone('');
    fetchStaff();
  };

  const deleteStaff = async (id) => {
    if (window.confirm("Supprimer ce membre ?")) {
      await fetch(`${API_URL}/staff/${id}`, { method: 'DELETE' });
      fetchStaff();
    }
  };

  const toggleSalary = async (member) => {
    await fetch(`${API_URL}/staff/${member._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payeCeMois: !member.payeCeMois })
    });
    fetchStaff();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-800 mb-6">Nouvelle Recrue</h2>
        <form onSubmit={addStaff} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input className="px-4 py-3 bg-gray-50 rounded-2xl border-none text-sm" placeholder="Nom" value={nom} onChange={(e)=>setNom(e.target.value)} required />
          <input className="px-4 py-3 bg-gray-50 rounded-2xl border-none text-sm" placeholder="Prénom" value={prenom} onChange={(e)=>setPrenom(e.target.value)} required />
          <input className="px-4 py-3 bg-gray-50 rounded-2xl border-none text-sm" placeholder="Téléphone" value={telephone} onChange={(e)=>setTelephone(e.target.value)} required />
          <input className="px-4 py-3 bg-gray-50 rounded-2xl border-none text-sm" placeholder="Salaire (DT)" type="number" value={salaire} onChange={(e)=>setSalaire(e.target.value)} required />
          <select className="px-4 py-3 bg-gray-50 rounded-2xl border-none text-xs font-bold" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option>Enseignante</option><option>Aide</option><option>Directrice</option>
          </select>
          <select className="px-4 py-3 bg-gray-50 rounded-2xl border-none text-xs font-bold" value={classe} onChange={(e)=>setClasse(e.target.value)}>
            <option>Petite Section</option><option>Moyenne Section</option><option>Grande Section</option><option>Toutes</option>
          </select>
          <button type="submit" className="lg:col-span-2 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">Enregistrer le profil</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((member) => (
          <div key={member._id} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black">{member.prenom[0]}</div>
                <div>
                  <h3 className="font-bold text-gray-800">{member.prenom} {member.nom}</h3>
                  <p className="text-[10px] font-black text-primary uppercase">{member.role}</p>
                </div>
              </div>
              <button onClick={() => deleteStaff(member._id)} className="text-gray-200 hover:text-secondary p-2"><Trash2 size={16}/></button>
            </div>

            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-3xl">
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                <Briefcase size={14} className="text-gray-400"/> {member.classe}
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                <Phone size={14} className="text-gray-400"/> {member.telephone}
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                <Banknote size={14} className="text-gray-400"/> {member.salaire} DT
              </div>
            </div>

            <button onClick={() => toggleSalary(member)} className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${member.payeCeMois ? 'bg-primary/10 text-primary' : 'bg-gray-900 text-white hover:bg-secondary'}`}>
              {member.payeCeMois ? <Check size={16}/> : <CreditCard size={16}/>} {member.payeCeMois ? 'Salaire Payé' : 'Payer'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}