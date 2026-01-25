const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// ==========================================
// CONFIGURATION DU CORS (SÉCURITÉ)
// ==========================================
const allowedOrigins = [
  'http://localhost:5173', // Ton interface locale
  'http://localhost:3000', 
  'https://lepetitpoussin.netlify.app' // REMPLACE PAR TON URL NETLIFY RÉELLE
];

app.use(cors({
  origin: function (origin, callback) {
    // Autorise les requêtes sans origine (comme sur certains navigateurs mobiles ou Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Accès refusé par la politique CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Servir les images uploadées (si tu n'utilises pas Cloudinary pour tout)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// CONNEXION MONGODB
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// ==========================================
// IMPORTATION DES ROUTES
// ==========================================
const childrenRoutes = require('./routes/children');
const staffRoutes = require('./routes/staff');
const expenseRoutes = require('./routes/expenses');
const eventRoutes = require('./routes/events');
const mediaRoutes = require('./routes/media');

app.use('/api/children', childrenRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Le serveur du Petit Poussin est opérationnel ! 🚀');
});

// ==========================================
// LANCEMENT DU SERVEUR
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`|-------------------------------------------|`);
  console.log(`| Serveur lancé sur le port : ${PORT}        |`);
  console.log(`|-------------------------------------------|`);
});