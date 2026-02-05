const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  nomComplet: {
    type: String,
    required: [true, "Le nom est obligatoire"]
  },
  role: {
    type: String,
    enum: ['Enseignante', 'Aide Soignante', 'Administration'],
    default: 'Enseignante'
  },
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
    unique: true // Empêche deux profs d'avoir le même code
  },
  dateEmbauche: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', StaffSchema);