import React, { useState, useEffect } from 'react';
import { Download, Heart } from 'lucide-react';

export default function EspaceClient() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts/public")
      .then(r => r.json())
      .then(data => setPhotos(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-black text-center mb-10">Journal de mon Enfant 🐣</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map(photo => (
          <div key={photo._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-4">
            <img 
              src={`http://localhost:5000${photo.mediaUrl}`} 
              className="w-full h-64 object-cover rounded-2xl mb-4"
              alt={photo.titre}
            />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">{photo.titre}</span>
              
              {/* BOUTON DE TÉLÉCHARGEMENT */}
              <a 
                href={`http://localhost:5000${photo.mediaUrl}`} 
                download={photo.titre}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
              >
                <Download size={20} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}