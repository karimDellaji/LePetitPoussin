const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// GET all staff
router.get('/', async (req, res) => {
  const staff = await Staff.find();
  res.json(staff);
});

// POST new staff
router.post('/', async (req, res) => {
  try {
    const { nomComplet, role, salaire, telephone, loginCode } = req.body;
    const newStaff = new Staff({
      nomComplet,
      role,
      salaire,
      telephone, // CRUCIAL : Vérifie que ce champ est bien là
      loginCode  // CRUCIAL : Vérifie que ce champ est bien là
    });
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update staff
router.put('/:id', async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE staff
router.delete('/:id', async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé" });
});

module.exports = router;