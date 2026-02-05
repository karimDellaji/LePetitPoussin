const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// DÉFINITION DU MODÈLE EVENT (S'il n'est pas déjà dans /models)
const eventSchema = new mongoose.Schema({
  type: String, // 'Photo', 'Annonce', 'Activité'
  titre: String,
  description: String,
  mediaUrl: String,
  enseignante: String,
  approuve: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

// On vérifie si le modèle existe déjà pour éviter l'erreur de redéfinition
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

// GET : Tous les événements (pour l'admin)
router.get('/events/all', async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.json(events);
});

// PATCH : Approuver une photo
router.patch('/events/:id/approve', async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { approuve: true });
  res.json({ success: true });
});

// DELETE : Supprimer/Refuser
router.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// POST : Envoi d'une activité par la maîtresse (via Multer)
// ... (garde ton code Multer ici, mais utilise "const Event" défini plus haut)

module.exports = router;
module.exports.Event = Event; // IMPORTANT pour l'import dans parent.js