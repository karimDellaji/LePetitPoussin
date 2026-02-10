const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  categorie: {
    type: String,
    enum: ['Facture', 'Salaire', 'Loyer', 'Matériel', 'Nourriture', 'Autre'],
    default: 'Autre'
  },
  date_depense: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
