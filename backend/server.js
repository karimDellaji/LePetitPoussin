const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import des modèles (UNIQUEMENT depuis models/)
const Child = require('./models/Child');
const Staff = require('./models/Staff');
const Transaction = require('./models/Transaction');
const Event = require('./models/Event'); // Nouveau modèle pour les événements

// Import des routes
const childrenRoutes = require('./routes/children');
const staffRoutes = require('./routes/staff');
const financeRoutes = require('./routes/finance');
const teacherRoutes = require('./routes/teacher');
const parentRoutes = require('./routes/parent');
const expensesRoutes = require('./routes/expenses'); // Nouveau
const eventsRoutes = require('./routes/events'); // Nouveau

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// --- CONNEXION DB ---
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/le_petit_poussin';
mongoose.connect(mongoURI)
  .then(() => console.log("✅ DB Connectée"))
  .catch(err => console.error("❌ Erreur DB:", err));

// --- UTILISATION DES ROUTES ---
app.use('/api/children', childrenRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/events', eventsRoutes);

// --- AUTH (gardée ici car simple) ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password, code } = req.body;
  
  // Admin login
  if (username === "admin" && password === "admin123") {
    return res.json({ role: 'admin', user: { nom: 'Directrice' } });
  }
  
  // Staff login (enseignant)
  const stf = await Staff.findOne({ loginCode: code });
  if (stf) {
    return res.json({ role: 'teacher', user: stf });
  }
  
  // Parent login
  const p = await Child.findOne({ parentCode: code });
  if (p) {
    return res.json({ role: 'parent', user: p });
  }
  
  res.status(401).json({ message: "Échec de l'authentification" });
});

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server Ready on port ${PORT}`));
