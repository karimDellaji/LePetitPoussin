const express = require('express');
const router = express.Router();
const Child = require('../models/Child');
const mongoose = require('mongoose');

// Le modèle Event est souvent resté dans teacher.js, on l'appelle dynamiquement
const Event = mongoose.models.Event;

router.post('/login', async (req, res) => {
  const { parentCode } = req.body;
  try {
    const child = await Child.findOne({ parentCode: parentCode.toUpperCase() });
    if (child) res.json({ success: true, child });
    else res.status(401).json({ success: false, message: "Code incorrect" });
  } catch (err) { res.status(500).json(err); }
});

router.get('/dashboard/:childId', async (req, res) => {
  try {
    const activities = await Event.find({ approuve: true }).sort({ date: -1 });
    res.json({ presence: "Présent", activities });
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;