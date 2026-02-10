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
  // CHAMP UNIFORMISÉ: 'parentTel' pour correspondre au frontend
  parentTel: { 
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
  tarif: { 
    type: Number, 
    required: true,
    default: 0 
  },
  // CHAMP UNIFORMISÉ: 'estPaye' utilisé partout
  estPaye: { 
    type: Boolean, 
    default: false 
  },
  observations: { 
    type: String, 
    default: '' 
  },
  // CHAMP UNIFORMISÉ: 'createdAt' pour correspondre au backend original
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Virtual pour compatibilité si besoin
childSchema.virtual('nomComplet').get(function() {
  return `${this.prenom} ${this.nom}`;
});

module.exports = mongoose.model('Child', childSchema);
