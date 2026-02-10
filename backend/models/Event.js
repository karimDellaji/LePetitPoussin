const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Photo', 'Annonce', 'Activité', 'Repas', 'Sieste', 'Sortie'],
    default: 'Activité'
  },
  titre: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  mediaUrl: { 
    type: String, 
    default: null 
  },
  enseignante: { 
    type: String, 
    required: true 
  },
  section: {
    type: String,
    enum: ['Petite Section', 'Moyenne Section', 'Grande Section'],
    default: 'Petite Section'
  },
  approuve: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Event', eventSchema);
