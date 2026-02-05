const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['Recette', 'Dépense'], required: true },
  categorie: { type: String, enum: ['Scolarité', 'Inscription', 'Salaire', 'Loyer', 'Matériel', 'Autre'], required: true },
  montant: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  enfantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
});

module.exports = mongoose.model('Transaction', transactionSchema);