const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); // Pour vérifier l'existence des fichiers

dotenv.config();
const app = express();

// CORS TOTAL (Pour débloquer le mobile)
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// CONNEXION MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ==========================================================
// CHARGEMENT SÉCURISÉ DES ROUTES
// ==========================================================
const routes = [
  { path: '/api/children', file: './routes/children' },
  { path: '/api/staff', file: './routes/staff' },
  { path: '/api/expenses', file: './routes/expenses' },
  { path: '/api/events', file: './routes/events' },
  { path: '/api/media', file: './routes/media' }
];

routes.forEach(route => {
  try {
    // On vérifie si le fichier existe (avec .js ou sans)
    const fullPath = path.join(__dirname, route.file + '.js');
    if (fs.existsSync(fullPath)) {
      app.use(route.path, require(route.file));
      console.log(`✅ Route chargée : ${route.path}`);
    } else {
      console.error(`⚠️ Fichier manquant : ${fullPath}`);
    }
  } catch (e) {
    console.error(`❌ Erreur chargement route ${route.path}:`, e.message);
  }
});

// Route de diagnostic
app.get('/', (req, res) => {
  res.json({ message: "Serveur Petit Poussin en ligne !", status: "OK" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));