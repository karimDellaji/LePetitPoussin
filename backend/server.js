const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: ["https://lepetitpoussin.netlify.app", "http://localhost:5173"], // Ajoute ton URL Netlify exacte
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/fresh_emerald', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connecté")).catch(err => console.log(err));

// --- MODÈLES ---
const Child = mongoose.model('Child', new mongoose.Schema({
    prenom: String, nom: String, telephone: String, section: String, 
    tarif: Number, parentCode: String, estPaye: { type: Boolean, default: false }
}));

const Staff = mongoose.model('Staff', new mongoose.Schema({
    nomComplet: String, role: String, salaire: Number, 
    telephone: String, loginCode: String
}));

const Finance = mongoose.model('Finance', new mongoose.Schema({
    type: String, categorie: String, montant: Number, 
    description: String, createdAt: { type: Date, default: Date.now }
}));

const Event = mongoose.model('Event', new mongoose.Schema({
    titre: String, type: String, enseignante: String, 
    section: String, approuve: { type: Boolean, default: false }, date: Date
}));

// --- ROUTES AUTHENTIFICATION ---

app.post('/api/auth/login', async (req, res) => {
    const { username, password, code } = req.body;

    // 1. Check Admin
    if (username === "admin" && password === "admin123") {
        return res.json({ role: 'admin', user: { name: "Direction" } });
    }

    // 2. Check Staff (ENS-XXX)
    if (code && code.startsWith('ENS-')) {
        const staff = await Staff.findOne({ loginCode: code });
        if (staff) return res.json({ role: 'teacher', user: staff });
    }

    // 3. Check Parent (POU-XXX)
    if (code && code.startsWith('POU-')) {
        const parent = await Child.findOne({ parentCode: code });
        if (parent) return res.json({ role: 'parent', user: parent });
    }

    res.status(401).json({ message: "Identifiants invalides" });
});

// --- AUTRES ROUTES (CRUD) ---
app.get('/api/children', async (req, res) => res.json(await Child.find()));
app.post('/api/children', async (req, res) => res.json(await new Child(req.body).save()));
app.patch('/api/children/:id/toggle-payment', async (req, res) => {
    const c = await Child.findById(req.params.id);
    c.estPaye = !c.estPaye;
    await c.save();
    res.json(c);
});

app.get('/api/staff', async (req, res) => res.json(await Staff.find()));
app.post('/api/staff', async (req, res) => res.json(await new Staff(req.body).save()));

app.get('/api/finance/all', async (req, res) => {
    const trans = await Finance.find().sort({ createdAt: -1 });
    const bilan = trans.reduce((acc, t) => {
        if (t.type === 'Recette') acc.solde += t.montant;
        else acc.solde -= t.montant;
        return acc;
    }, { solde: 0 });
    res.json({ transactions: trans, bilan });
});
app.post('/api/finance/add', async (req, res) => res.json(await new Finance(req.body).save()));

app.get('/api/teacher/events/all', async (req, res) => res.json(await Event.find()));
app.post('/api/teacher/events/add', async (req, res) => res.json(await new Event(req.body).save()));
app.patch('/api/teacher/events/:id/approve', async (req, res) => res.json(await Event.findByIdAndUpdate(req.params.id, { approuve: true })));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));