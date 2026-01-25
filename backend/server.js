require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// CONNEXION MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// CONFIG CLOUDINARY
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'petit-poussin', allowed_formats: ['jpg', 'png', 'jpeg'] },
});
const upload = multer({ storage: storage });

// MODÈLES
const Child = mongoose.model('Child', new mongoose.Schema({ 
    nom: String, prenom: String, section: String, tarif: Number, 
    parentTel: String, parentCode: { type: String, unique: true },
    paye: { type: Boolean, default: false }, present: { type: Boolean, default: false },
    dateInscription: { type: Date, default: Date.now }
}));

const Staff = mongoose.model('Staff', new mongoose.Schema({
    nom: String, prenom: String, telephone: String, classe: String, codeAcces: { type: String, unique: true }
}));

const Media = mongoose.model('Media', new mongoose.Schema({
    url: String, enseignante: String, classe: String, status: { type: String, default: 'en_attente' }, date: { type: Date, default: Date.now }
}));

const Expense = mongoose.model('Expense', new mongoose.Schema({ label: String, montant: Number, date: { type: Date, default: Date.now } }));
const Event = mongoose.model('Event', new mongoose.Schema({ titre: String, date: String, description: String }));

// --- ROUTES AUTH ---
app.post('/api/auth/login', async (req, res) => {
    const { roleType, username, password, codeAcces, code } = req.body;
    if (roleType === 'admin' && username === "admin" && password === "admin123") return res.json({ role: 'admin' });
    if (roleType === 'teacher') {
        const t = await Staff.findOne({ nom: username, codeAcces: codeAcces });
        if (t) return res.json({ role: 'teacher', info: t });
    }
    if (roleType === 'parent') {
        const c = await Child.findOne({ parentCode: code });
        if (c) return res.json({ role: 'parent', info: c });
    }
    res.status(401).json({ message: "Erreur" });
});

// --- ROUTES MÉDIAS (CORRIGÉES POUR RÉCEPTION) ---
app.post('/api/media/upload', upload.single('image'), async (req, res) => {
    try {
        const newMedia = new Media({
            url: req.file.path,
            enseignante: req.body.enseignante,
            classe: req.body.classe,
            status: 'en_attente',
            date: new Date()
        });
        await newMedia.save();
        res.json(newMedia);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/media/admin', async (req, res) => res.json(await Media.find().sort({date: -1})));
app.patch('/api/media/:id/approve', async (req, res) => res.json(await Media.findByIdAndUpdate(req.params.id, {status: 'approuve'}, {new: true})));
app.delete('/api/media/:id', async (req, res) => { await Media.findByIdAndDelete(req.params.id); res.json({message: "ok"}); });

// --- AUTRES ROUTES ---
app.get('/api/children', async (req, res) => res.json(await Child.find().sort({nom: 1})));
app.post('/api/children', async (req, res) => {
    const code = "POU-" + Math.floor(1000 + Math.random() * 9000);
    const n = new Child({ ...req.body, parentCode: code });
    await n.save(); res.json(n);
});
app.put('/api/children/:id', async (req, res) => res.json(await Child.findByIdAndUpdate(req.params.id, req.body, {new: true})));
app.patch('/api/children/:id/pay', async (req, res) => { const c = await Child.findById(req.params.id); c.paye = !c.paye; await c.save(); res.json(c); });
app.patch('/api/children/:id/presence', async (req, res) => { const c = await Child.findById(req.params.id); c.present = !c.present; await c.save(); res.json(c); });
app.delete('/api/children/:id', async (req, res) => { await Child.findByIdAndDelete(req.params.id); res.json({message: "ok"}); });

app.get('/api/staff', async (req, res) => res.json(await Staff.find().sort({nom: 1})));
app.post('/api/staff', async (req, res) => {
    const code = "ENS-" + Math.floor(100 + Math.random() * 900);
    const s = new Staff({ ...req.body, codeAcces: code });
    await s.save(); res.json(s);
});
app.delete('/api/staff/:id', async (req, res) => { await Staff.findByIdAndDelete(req.params.id); res.json({message: "ok"}); });

app.get('/api/expenses', async (req, res) => res.json(await Expense.find().sort({date: -1})));
app.post('/api/expenses', async (req, res) => { const n = new Expense(req.body); await n.save(); res.json(n); });
app.delete('/api/expenses/:id', async (req, res) => { await Expense.findByIdAndDelete(req.params.id); res.json({message: "ok"}); });

app.get('/api/events', async (req, res) => res.json(await Event.find().sort({date: 1})));
app.post('/api/events', async (req, res) => { const n = new Event(req.body); await n.save(); res.json(n); });
app.delete('/api/events/:id', async (req, res) => { await Event.findByIdAndDelete(req.params.id); res.json({message: "ok"}); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));