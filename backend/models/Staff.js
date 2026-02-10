const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  nomComplet: {
    type: String,
    required: [true, "Le nom est obligatoire"]
  },
  role: {
    type: String,
    enum: ['Directrice', 'Enseignante', 'Aide Soignante', 'Administration', 'Aide'],
    default: 'Enseignante'
  },
  // CHAMP UNIFORMISÉ: 'telephone' pour correspondre au frontend
  telephone: {
    type: String,
    required: [true, "Le numéro de téléphone est obligatoire"]
  },
  salaire: {
    type: Number,
    required: [true, "Le salaire est obligatoire"]
  },
  loginCode: {
    type: String,
    required: true,
    unique: true
  },
  // CHAMP UNIFORMISÉ: 'createdAt' pour cohérence
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', staffSchema);
