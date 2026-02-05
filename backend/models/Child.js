const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  prenom: { 
    type: String, 
    required: true,
    trim: true 
  },
  nom: { 
    type: String, 
    required: true,
    trim: true 
  },
  telephone: { 
    type: String, 
    required: true 
  },
  section: { 
    type: String, 
    enum: ['Petite Section', 'Moyenne Section', 'Grande Section'], 
    default: 'Petite Section' 
  },
  parentCode: { 
    type: String, 
    unique: true 
  },
  // --- NOUVEAUX CHAMPS POUR LE DÉPLOIEMENT ---
  tarif: { 
    type: Number, 
    required: true,
    default: 0 
  },
  estPaye: { 
    type: Boolean, 
    default: false 
  },
  observations: { 
    type: String, 
    default: '' 
  },
  // ------------------------------------------
  dateInscription: { 
    type: Date, 
    default: Date.now 
  }
});

// Optionnel : Un petit helper pour formater le nom complet si besoin
childSchema.virtual('nomComplet').get(function() {
  return `${this.prenom} ${this.nom}`;
});

module.exports = mongoose.model('Child', childSchema);