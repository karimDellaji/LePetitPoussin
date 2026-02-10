const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

/**
 * @route   GET /api/staff
 * @desc    Récupérer tout le personnel
 */
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du personnel", error: err.message });
  }
});

/**
 * @route   POST /api/staff
 * @desc    Ajouter un nouveau membre du personnel
 */
router.post('/', async (req, res) => {
  try {
    const { nomComplet, role, salaire, telephone } = req.body;
    
    // Générer un code de connexion unique
    const loginCode = "ENS-" + Math.floor(1000 + Math.random() * 9000);
    
    const newStaff = new Staff({
      nomComplet,
      role,
      salaire: Number(salaire),
      telephone,
      loginCode
    });
    
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout du personnel", error: err.message });
  }
});

/**
 * @route   PUT /api/staff/:id
 * @desc    Mettre à jour un membre du personnel
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedStaff) {
      return res.status(404).json({ message: "Personnel non trouvé" });
    }
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
});

/**
 * @route   DELETE /api/staff/:id
 * @desc    Supprimer un membre du personnel
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Personnel non trouvé" });
    }
    res.json({ message: "Supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});

module.exports = router;
