const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Recette', 'Depense', 'Dépense'], // Les deux orthographes pour compatibilité
    required: true 
  },
  categorie: { 
    type: String, 
    enum: ['Scolarité', 'Inscription', 'Salaire', 'Loyer', 'Matériel', 'Autre'],
    default: 'Autre'
  },
  montant: { 
    type: Number, 
    required: true 
  },
  description: {
    type: String,
    default: ''
  },
  // CHAMP UNIFORMISÉ: 'createdAt' pour cohérence avec le backend
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  // Références optionnelles
  enfantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Child',
    default: null
  },
  staffId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Staff',
    default: null
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
