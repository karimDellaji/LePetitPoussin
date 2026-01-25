const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Chargement des variables d'environnement (.env)
dotenv.config();

const app = express();

// ==========================================================
// CONFIGURATION DU CORS (Ouverture totale pour test mobile)
// ==========================================================
app.use(cors({
  origin: '*', // Autorise absolument toutes les sources (PC, Mobile, Tablettes)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Servir le dossier uploads si nécessaire
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================================
// CONNEXION À LA BASE DE DONNÉES MONGODB
// ==========================================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté avec succès à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur critique de connexion MongoDB:', err));

// ==========================================================
// IMPORTATION ET RÉGISTRE DES ROUTES
// ==========================================================
// Assure-toi que ces fichiers existent bien dans ton dossier backend/routes/
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

// Route de diagnostic (Test direct dans le navigateur)
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "Le serveur du Petit Poussin est opérationnel ! 🚀",
    status: "En ligne",
    timestamp: new Date()
  });
});

// ==========================================================
// LANCEMENT DU SERVEUR
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 SERVEUR DÉMARRÉ SUR LE PORT : ${PORT}`);
  console.log(`🌍 URL DE TEST : http://localhost:${PORT}/`);
  console.log(`=============================================`);
});