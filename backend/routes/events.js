const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

/**
 * @route   GET /api/events
 * @desc    Récupérer tous les événements
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des événements", error: err.message });
  }
});

/**
 * @route   POST /api/events
 * @desc    Créer un nouvel événement
 */
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      date: new Date()
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création de l'événement", error: err.message });
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Supprimer un événement
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json({ message: "Événement supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});

module.exports = router;
