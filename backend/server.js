const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Configuration CORS
app.use(cors({ origin: '*' }));
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ==========================================
// ROUTE DE LOGIN (DIRECTE DANS SERVER.JS)
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Test simple (à améliorer plus tard avec une vraie DB)
  if (email === "admin" && password === "admin123") {
    return res.json({
      token: "fake-jwt-token",
      role: "admin",
      message: "Connexion réussie"
    });
  }
  
  res.status(401).json({ message: "Identifiants invalides" });
});

// Route test racine
app.get('/', (req, res) => {
  res.json({ status: "Serveur opérationnel", message: "Le Petit Poussin est en ligne !" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));