import { useEffect, useState } from 'react';
import { Users, CheckCircle, TrendingUp, PieChart, RefreshCw, DollarSign } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({ 
    total: 0, 
    presents: 0, 
    revenus: 0, 
    sections: { "Petite Section": 0, "Moyenne Section": 0, "Grande Section": 0 } 
  });

  const loadStats = () => {
    fetch("http://localhost:5000/api/stats")
      .then(res => res.json())
      .then(data => setStats({
        total: data.total || 0,
        presents: data.presents || 0,
        revenus: data.revenus || 0,
        sections: data.sections || { "Petite Section": 0, "Moyenne Section": 0, "Grande Section": 0 }
      }))
      .catch(err => console.error("Erreur de stats"));
  };

  useEffect(() => { loadStats(); }, []);

  const taux = stats.total > 0 ? Math.round((stats.presents / stats.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <Users className="text-primary mb-3" size={32} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Élèves</p>
          <p className="text-4xl font-black text-gray-800">{stats.total}</p>
        </div>

        <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl shadow-primary/20">
          <CheckCircle className="opacity-50 mb-3" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Présents</p>
          <p className="text-4xl font-black">{stats.presents}<span className="text-xl opacity-40"> / {stats.total}</span></p>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-[2.5rem]">
          <TrendingUp className="text-primary mb-3" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Taux</p>
          <p className="text-4xl font-black">{taux}%</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <DollarSign className="text-green-500 mb-3" size={32} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenus (Payés)</p>
          <p className="text-4xl font-black text-gray-800">{stats.revenus} <span className="text-sm">DT</span></p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-black text-gray-800 flex items-center gap-2 uppercase text-sm tracking-widest">
            <PieChart size={20} className="text-primary"/> Répartition Sections
          </h3>
          <button onClick={loadStats} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><RefreshCw size={20} className="text-primary" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(stats.sections).map(([name, count]) => (
            <div key={name} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{name}</p>
              <p className="text-3xl font-black text-gray-800">{count}</p>
              <div className="mt-4 w-full h-1.5 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}