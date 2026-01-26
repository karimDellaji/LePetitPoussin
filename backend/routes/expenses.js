const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  label: String, montant: Number, date: { type: Date, default: Date.now }
});
const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

router.get('/', async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

router.post('/', async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.json(newExpense);
});

router.delete('/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé" });
});

module.exports = router;