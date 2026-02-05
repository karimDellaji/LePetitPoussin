const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://admin_katkout:vajAweLnOP9b7Ibh@cluster0.voontzo.mongodb.net/LePetitPoussin?retryWrites=true&w=majority'; 

const migrate = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("🚀 Connexion établie. Début de la mise à jour V1.0.1...");

        // Accès aux collections
        const db = mongoose.connection;
        
        // 1. Mise à jour des ÉLÈVES (Codes POU-XXX)
        const children = await db.collection('children').find({ parentCode: { $exists: false } }).toArray();
        console.log(`📝 ${children.length} élèves à mettre à jour...`);
        
        for (let child of children) {
            const code = `POU-${Math.floor(100 + Math.random() * 899)}`;
            await db.collection('children').updateOne({ _id: child._id }, { $set: { parentCode: code } });
        }

        // 2. Mise à jour du STAFF (Codes ENS-XXX)
        const staffs = await db.collection('staffs').find({ loginCode: { $exists: false } }).toArray();
        console.log(`📝 ${staffs.length} membres du staff à mettre à jour...`);

        for (let member of staffs) {
            const code = `ENS-${Math.floor(100 + Math.random() * 899)}`;
            await db.collection('staffs').updateOne({ _id: member._id }, { $set: { loginCode: code } });
        }

        console.log("✅ Migration terminée avec succès !");
        process.exit(0);
    } catch (err) {
        console.error("❌ Erreur critique :", err);
        process.exit(1);
    }
};

migrate();