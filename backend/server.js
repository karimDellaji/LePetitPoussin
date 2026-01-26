const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(cors());

// --- CONNEXION MONGODB ---
mongoose.connect(process.env.MONGO_URI || "ton_lien_mongodb_ici")
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// --- IMPORT DES ROUTES ---
const childrenRoutes = require('./routes/children');
const staffRoutes = require('./routes/staff');
const expensesRoutes = require('./routes/expenses');
const eventsRoutes = require('./routes/events');
const mediaRoutes = require('./routes/media');

// --- ROUTE D'AUTHENTIFICATION (LOGIN) ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Acceptation de "admin" ou "admin@test.com" pour la V1.0.0
  if ((email === "admin" || email === "admin@test.com") && password === "admin123") {
    console.log("✅ Connexion réussie");
    return res.json({ 
      token: "fake-jwt-token-for-now", 
      role: "admin",
      user: { name: "Administrateur" }
    });
  }
  
  console.log("❌ Tentative de connexion échouée");
  res.status(401).json({ message: "Identifiants incorrects" });
});

// --- UTILISATION DES ROUTES ---
app.use('/api/children', childrenRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/media', mediaRoutes);

// --- ROUTE DE TEST ---
app.get('/', (req, res) => {
  res.send("🚀 Serveur Le Petit Poussin est en ligne !");
});

// --- LANCEMENT DU SERVEUR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur le port ${PORT}`);
});