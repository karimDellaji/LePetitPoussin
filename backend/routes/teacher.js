const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

/**
 * @route   GET /api/teacher/events/all
 * @desc    Tous les événements (pour l'admin)
 */
router.get('/events/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des événements", error: err.message });
  }
});

/**
 * @route   GET /api/teacher/events/approved/:section
 * @desc    Événements approuvés pour une section (pour les parents)
 */
router.get('/events/approved/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const events = await Event.find({ 
      approuve: true,
      section: section 
    }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des événements", error: err.message });
  }
});

/**
 * @route   POST /api/teacher/events/add
 * @desc    Ajouter un nouvel événement (par l'enseignant)
 */
router.post('/events/add', async (req, res) => {
  try {
    const { titre, type, description, enseignante, section, mediaUrl } = req.body;
    
    const newEvent = new Event({
      titre,
      type: type || 'Activité',
      description: description || '',
      enseignante,
      section: section || 'Petite Section',
      mediaUrl: mediaUrl || null,
      approuve: false, // Nécessite validation Admin
      date: new Date()
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout de l'événement", error: err.message });
  }
});

/**
 * @route   PATCH /api/teacher/events/:id/approve
 * @desc    Approuver un événement (par l'admin)
 */
router.patch('/events/:id/approve', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { approuve: true },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json({ success: true, event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'approbation", error: err.message });
  }
});

/**
 * @route   DELETE /api/teacher/events/:id
 * @desc    Supprimer/Refuser un événement
 */
router.delete('/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json({ success: true, message: "Événement supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});

module.exports = router;
