const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// --- MODÈLES ---
const ChildSchema = new mongoose.Schema({
  prenom: String, nom: String, section: String, tarif: Number,
  estPaye: { type: Boolean, default: false },
  parentCode: String, parentTel: String,
  createdAt: { type: Date, default: Date.now }
});

const StaffSchema = new mongoose.Schema({
  nomComplet: String, role: String, salaire: Number, 
  loginCode: String, telephone: String
});

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['Recette', 'Depense'] },
  montant: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Child = mongoose.model('Child', ChildSchema);
const Staff = mongoose.model('Staff', StaffSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// --- CONNEXION DB ---
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fresh_emerald';
mongoose.connect(mongoURI).then(() => console.log("✅ DB Connectée")).catch(err => console.error(err));

// --- ROUTES ÉLÈVES ---
app.get('/api/children', async (req, res) => res.json(await Child.find().sort({createdAt: -1})));
app.post('/api/children', async (req, res) => {
  const code = "POU-" + Math.floor(1000 + Math.random() * 9000);
  const newChild = new Child({ ...req.body, parentCode: code });
  await newChild.save();
  res.json(newChild);
});
app.patch('/api/children/:id', async (req, res) => {
  const updated = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.delete('/api/children/:id', async (req, res) => {
  await Child.findByIdAndDelete(req.params.id);
  res.json({ msg: "OK" });
});

// --- ROUTES STAFF ---
app.get('/api/staff', async (req, res) => res.json(await Staff.find()));
app.post('/api/staff', async (req, res) => {
  const code = "ENS-" + Math.floor(1000 + Math.random() * 9000);
  const newStaff = new Staff({ ...req.body, loginCode: code });
  await newStaff.save();
  res.json(newStaff);
});
app.patch('/api/staff/:id', async (req, res) => {
  const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.delete('/api/staff/:id', async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ msg: "OK" });
});

// --- ROUTES FINANCES ---
app.get('/api/finance/all', async (req, res) => {
  const transactions = await Transaction.find().sort({createdAt: -1});
  const recettes = transactions.filter(t => t.type === 'Recette').reduce((sum, t) => sum + t.montant, 0);
  const depenses = transactions.filter(t => t.type === 'Depense').reduce((sum, t) => sum + t.montant, 0);
  res.json({ transactions, bilan: { solde: recettes - depenses, recettes, depenses } });
});

app.post('/api/finance', async (req, res) => {
  const trans = new Transaction(req.body);
  await trans.save();
  res.json(trans);
});

app.delete('/api/finance/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ msg: "OK" });
});

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password, code } = req.body;
  if(username === "admin" && password === "admin123") return res.json({ role: 'admin', user: {nom: 'Directrice'} });
  const stf = await Staff.findOne({ loginCode: code });
  if(stf) return res.json({ role: 'teacher', user: stf });
  const p = await Child.findOne({ parentCode: code });
  if(p) return res.json({ role: 'parent', user: p });
  res.status(401).json({ message: "Échec" });
});

app.listen(5000, () => console.log("🚀 Server Ready"));