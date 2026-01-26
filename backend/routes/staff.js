const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schéma rapide pour le personnel
const StaffSchema = new mongoose.Schema({
  prenom: String, nom: String, telephone: String, classe: String, codeAcces: String
});
const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

router.get('/', async (req, res) => {
  const staff = await Staff.find();
  res.json(staff);
});

router.post('/', async (req, res) => {
  const newStaff = new Staff({...req.body, codeAcces: Math.floor(1000 + Math.random() * 9000)});
  await newStaff.save();
  res.json(newStaff);
});

router.delete('/:id', async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé" });
});

module.exports = router;