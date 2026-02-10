const express = require('express');
const router = express.Router();
const Child = require('../models/Child');
const Event = require('../models/Event');

/**
 * @route   POST /api/parent/login
 * @desc    Connexion parent avec code
 */
router.post('/login', async (req, res) => {
  try {
    const { parentCode } = req.body;
    const child = await Child.findOne({ parentCode: parentCode.toUpperCase() });
    
    if (child) {
      res.json({ success: true, child });
    } else {
      res.status(401).json({ success: false, message: "Code incorrect" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

/**
 * @route   GET /api/parent/dashboard/:childId
 * @desc    Tableau de bord parent avec activités
 */
router.get('/dashboard/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    
    // Récupérer l'enfant
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "Enfant non trouvé" });
    }
    
    // Récupérer les activités approuvées pour la section de l'enfant
    const activities = await Event.find({ 
      approuve: true,
      section: child.section 
    }).sort({ date: -1 });
    
    res.json({ 
      child,
      presence: "Présent", // À implémenter avec un vrai système de présence
      activities 
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

/**
 * @route   GET /api/parent/child/:parentCode
 * @desc    Récupérer les infos d'un enfant par code parent
 */
router.get('/child/:parentCode', async (req, res) => {
  try {
    const { parentCode } = req.params;
    const child = await Child.findOne({ parentCode: parentCode.toUpperCase() });
    
    if (!child) {
      return res.status(404).json({ message: "Enfant non trouvé" });
    }
    
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
