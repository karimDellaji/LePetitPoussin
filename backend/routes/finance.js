const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

/**
 * @route   GET /api/finance/all
 * @desc    Récupérer toutes les transactions et le bilan
 */
router.get('/all', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    
    const recettes = transactions
      .filter(t => t.type === 'Recette')
      .reduce((acc, curr) => acc + curr.montant, 0);
    
    const depenses = transactions
      .filter(t => t.type === 'Depense' || t.type === 'Dépense')
      .reduce((acc, curr) => acc + curr.montant, 0);
    
    res.json({
      transactions,
      bilan: {
        recettes,
        depenses,
        solde: recettes - depenses
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des finances", error: err.message });
  }
});

/**
 * @route   POST /api/finance
 * @desc    Ajouter une transaction
 */
router.post('/', async (req, res) => {
  try {
    const { type, categorie, montant, description } = req.body;
    
    const nouvelleTransaction = new Transaction({
      type,
      categorie: categorie || 'Autre',
      montant: Number(montant),
      description: description || '',
      createdAt: new Date()
    });

    const saved = await nouvelleTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout de la transaction", error: err.message });
  }
});

/**
 * @route   PUT /api/finance/:id
 * @desc    Modifier une transaction
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Transaction non trouvée" });
    }
    res.json({ message: "Transaction mise à jour", transaction: updated });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
});

/**
 * @route   DELETE /api/finance/:id
 * @desc    Supprimer une transaction
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Transaction introuvable" });
    }
    res.json({ message: "Transaction supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression", error: err.message });
  }
});

module.exports = router;
