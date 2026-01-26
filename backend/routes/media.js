const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  url: String, enseignante: String, section: String, status: { type: String, default: 'en_attente' }, date: { type: Date, default: Date.now }
});
const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);

router.get('/admin', async (req, res) => {
  const media = await Media.find().sort({ date: -1 });
  res.json(media);
});

router.patch('/:id/approve', async (req, res) => {
  await Media.findByIdAndUpdate(req.params.id, { status: 'approuvé' });
  res.json({ message: "Approuvé" });
});

router.delete('/:id', async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé" });
});

module.exports = router;