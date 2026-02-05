const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Vérifie le nom de ton modèle

// GET : Récupérer toutes les transactions et le bilan
router.get('/all', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    const recettes = transactions.filter(t => t.type === 'Recette').reduce((acc, curr) => acc + curr.montant, 0);
    const depenses = transactions.filter(t => t.type === 'Dépense').reduce((acc, curr) => acc + curr.montant, 0);
    
    res.json({
      transactions,
      bilan: {
        recettes,
        depenses,
        solde: recettes - depenses
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST : Ajouter une transaction
router.post('/add', async (req, res) => {
  const { type, categorie, montant, description } = req.body;
  const nouvelleTransaction = new Transaction({
    type,
    categorie,
    montant: Number(montant),
    description,
    date: new Date()
  });

  try {
    const saved = await nouvelleTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//UPDATE : Modifier une transaction
router.put('/:id', async (req, res) => {
  await Transaction.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Transaction mise à jour" });
});

// DELETE : Supprimer une transaction (LA ROUTE QUI MANQUAIT)
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Introuvable" });
    res.json({ message: "Transaction supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
});

module.exports = router;