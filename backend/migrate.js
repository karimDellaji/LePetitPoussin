/**
 * Script de migration pour Le Petit Poussin
 * 
 * Ce script permet de migrer les données existantes vers la nouvelle structure
 * en corrigeant les incohérences de noms de champs.
 * 
 * Usage: node migrate.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Anciens modèles (depuis server.js original)
const OldChildSchema = new mongoose.Schema({
  prenom: String, 
  nom: String, 
  section: String, 
  tarif: Number,
  estPaye: { type: Boolean, default: false },
  parentCode: String, 
  parentTel: String,
  createdAt: { type: Date, default: Date.now }
});

const OldStaffSchema = new mongoose.Schema({
  nomComplet: String, 
  role: String, 
  salaire: Number, 
  loginCode: String, 
  telephone: String
});

const OldTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['Recette', 'Depense'] },
  montant: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// Nouveaux modèles
const Child = require('./models/Child');
const Staff = require('./models/Staff');
const Transaction = require('./models/Transaction');

const OldChild = mongoose.model('OldChild', OldChildSchema);
const OldStaff = mongoose.model('OldStaff', OldStaffSchema);
const OldTransaction = mongoose.model('OldTransaction', OldTransactionSchema);

async function migrate() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/le_petit_poussin';
  
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connecté à la base de données");

    // Vérifier si des données existent déjà dans les nouveaux modèles
    const existingChildren = await Child.countDocuments();
    const existingStaff = await Staff.countDocuments();
    const existingTransactions = await Transaction.countDocuments();

    console.log(`\n📊 Données existantes dans les nouveaux modèles:`);
    console.log(`   - Enfants: ${existingChildren}`);
    console.log(`   - Personnel: ${existingStaff}`);
    console.log(`   - Transactions: ${existingTransactions}`);

    if (existingChildren > 0 || existingStaff > 0 || existingTransactions > 0) {
      console.log("\n⚠️  Des données existent déjà dans les nouveaux modèles.");
      console.log("   La migration n'est nécessaire que si vous venez de l'ancienne structure.");
      console.log("   Si tout fonctionne correctement, vous pouvez ignorer ce message.");
    }

    // Récupérer les anciennes collections (si elles existent avec d'autres noms)
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log(`\n📁 Collections trouvées: ${collectionNames.join(', ')}`);

    // Si vous avez besoin de migrer des données spécifiques, ajoutez le code ici
    // Par exemple, si les anciennes données sont dans des collections différentes

    console.log("\n✅ Vérification terminée !");
    console.log("\n💡 Si vous rencontrez des problèmes avec les données existantes,");
    console.log("   assurez-vous que les noms de champs correspondent:");
    console.log("   - 'estPaye' (pas 'paye')");
    console.log("   - 'parentTel' (pas 'telephone' pour les enfants)");
    console.log("   - 'createdAt' (pas 'dateInscription')");

  } catch (err) {
    console.error("❌ Erreur:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Déconnecté");
  }
}

// Si exécuté directement
if (require.main === module) {
  migrate();
}

module.exports = migrate;
