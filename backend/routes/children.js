const express = require('express');
const router = express.Router();
const Child = require('../models/Child');

/**
 * @route   GET /api/children
 * @desc    Récupérer tous les élèves
 */
router.get('/', async (req, res) => {
  try {
    const children = await Child.find().sort({ dateInscription: -1 });
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des élèves", error: err });
  }
});

/**
 * @route   POST /api/children
 * @desc    Inscrire un nouvel élève (avec tarif et observations)
 */
router.post('/', async (req, res) => {
  try {
    const parentCode = "POU-" + Math.floor(1000 + Math.random() * 9000);
    
    const newChild = new Child({
      prenom: req.body.prenom,
      nom: req.body.nom,
      telephone: req.body.telephone,
      section: req.body.section,
      tarif: req.body.tarif,
      observations: req.body.observations,
      parentCode: parentCode
    });

    const savedChild = await newChild.save();
    res.status(201).json(savedChild);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'inscription", error: err });
  }
});

/**
 * @route   PUT /api/children/:id
 * @desc    Mettre à jour les infos d'un enfant (Fonction Update du Dashboard)
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedChild = await Child.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedChild);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err });
  }
});

/**
 * @route   PATCH /api/children/:id/toggle-payment
 * @desc    Basculer le statut payé/impayé
 */
router.patch('/:id/toggle-payment', async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) return res.status(404).json({ message: "Enfant non trouvé" });
    
    child.estPaye = !child.estPaye;
    await child.save();
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du changement de statut", error: err });
  }
});

/**
 * @route   DELETE /api/children/:id
 * @desc    Supprimer un élève
 */
router.delete('/:id', async (req, res) => {
  try {
    await Child.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Élève supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err });
  }
});

module.exports = router;