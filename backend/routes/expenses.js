const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

/**
 * @route   GET /api/expenses
 * @desc    Récupérer toutes les dépenses
 */
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date_depense: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des dépenses", error: err.message });
  }
});

/**
 * @route   POST /api/expenses
 * @desc    Ajouter une nouvelle dépense
 */
router.post('/', async (req, res) => {
  try {
    const { titre, montant, description, categorie } = req.body;
    
    const newExpense = new Expense({
      titre,
      montant: Number(montant),
      description: description || '',
      categorie: categorie || 'Autre',
      date_depense: new Date()
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout de la dépense", error: err.message });
  }
});

/**
 * @route   PUT /api/expenses/:id
 * @desc    Mettre à jour une dépense
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Supprimer une dépense
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }
    res.json({ success: true, message: "Dépense supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
  }
});

module.exports = router;
