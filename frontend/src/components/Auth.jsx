import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Inscription dans le système Auth de Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'super_admin' } // On force le premier en admin
      }
    });

    if (error) alert(error.message);
    else alert('Vérifiez votre boîte mail pour confirmer l\'inscription !');
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignUp} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Créer un compte Admin</h2>
        <input 
          className="w-full p-2 mb-4 border rounded" 
          type="text" placeholder="Nom complet" 
          value={fullName} onChange={(e) => setFullName(e.target.value)} required
        />
        <input 
          className="w-full p-2 mb-4 border rounded" 
          type="email" placeholder="Email" 
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <input 
          className="w-full p-2 mb-4 border rounded" 
          type="password" placeholder="Mot de passe" 
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        <button 
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? 'Chargement...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
}