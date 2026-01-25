const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// --- ROUTES ---

// 1. Login direct (pour que ça marche tout de suite)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === "admin" && password === "admin123") {
    return res.json({ token: "fake-jwt", role: "admin" });
  }
  res.status(401).json({ message: "Identifiants incorrects" });
});

// 2. Importation de la route children (si le fichier existe)
try {
    const childrenRoutes = require('./routes/children');
    app.use('/api/children', childrenRoutes);
    console.log("✅ Route children chargée");
} catch (e) {
    console.log("⚠️ Le dossier routes/children.js n'est pas encore détecté");
}

app.get('/', (req, res) => res.json({ status: "OK" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur sur port ${PORT}`));