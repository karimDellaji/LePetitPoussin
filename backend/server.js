const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Plus simple pour éviter les blocages CORS en test

// Modèle Enfant avec Téléphone
const ChildSchema = new mongoose.Schema({
  prenom: String, nom: String, section: String, 
  tarif: Number, estPaye: { type: Boolean, default: false },
  parentCode: String, parentTel: String, // Ajouté
  createdAt: { type: Date, default: Date.now }
});

// Modèle Staff avec Téléphone
const StaffSchema = new mongoose.Schema({
  nomComplet: String, role: String, salaire: Number, 
  loginCode: String, telephone: String // Ajouté
});

// Modèle Transaction (pour le calcul automatique)
const TransactionSchema = new mongoose.Schema({
  type: String, montant: Number, description: String, createdAt: { type: Date, default: Date.now }
});

const Child = mongoose.model('Child', ChildSchema);
const Staff = mongoose.model('Staff', StaffSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// CONNEXION MONGODB (Indispensable pour Render)
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fresh_emerald';
mongoose.connect(mongoURI).then(() => console.log("✅ DB Connectée")).catch(err => console.log(err));

// API : Basculer Paiement + Créer une Recette automatique
app.patch('/api/children/:id/toggle-payment', async (req, res) => {
  const child = await Child.findById(req.id || req.params.id);
  child.estPaye = !child.estPaye;
  await child.save();
  
  if(child.estPaye) {
    await Transaction.create({ type: 'Recette', montant: child.tarif, description: `Frais scolarité: ${child.prenom}` });
  }
  res.json(child);
});

// API : Routes standards (Ajout/Suppression/Update)
app.get('/api/children', async (req, res) => res.json(await Child.find().sort({createdAt: -1})));
app.post('/api/children', async (req, res) => {
  const code = "POU-" + Math.floor(1000 + Math.random() * 9000);
  const newChild = new Child({ ...req.body, parentCode: code });
  await newChild.save();
  res.json(newChild);
});
app.delete('/api/children/:id', async (req, res) => { await Child.findByIdAndDelete(req.params.id); res.json({msg: "OK"}); });

app.get('/api/staff', async (req, res) => res.json(await Staff.find()));
app.post('/api/staff', async (req, res) => {
  const code = "ENS-" + Math.floor(1000 + Math.random() * 9000);
  const newStaff = new Staff({ ...req.body, loginCode: code });
  await newStaff.save();
  res.json(newStaff);
});
app.delete('/api/staff/:id', async (req, res) => { await Staff.findByIdAndDelete(req.params.id); res.json({msg: "OK"}); });

app.get('/api/finance/all', async (req, res) => {
  const transactions = await Transaction.find().sort({createdAt: -1});
  const recettes = transactions.filter(t => t.type === 'Recette').reduce((sum, t) => sum + t.montant, 0);
  const depenses = transactions.filter(t => t.type === 'Depense').reduce((sum, t) => sum + t.montant, 0);
  res.json({ transactions, bilan: { solde: recettes - depenses, recettes, depenses } });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password, code } = req.body;
  if(username === "admin" && password === "admin123") return res.json({ role: 'admin', user: {nom: 'Directrice'} });
  const staff = await Staff.findOne({ loginCode: code });
  if(staff) return res.json({ role: 'teacher', user: staff });
  const parent = await Child.findOne({ parentCode: code });
  if(parent) return res.json({ role: 'parent', user: parent });
  res.status(401).json({ message: "Échec" });
});

app.listen(5000, () => console.log("🚀 Port 5000"));