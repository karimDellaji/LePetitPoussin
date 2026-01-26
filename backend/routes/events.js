const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  titre: String, description: String, date: Date
});
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

router.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

router.post('/', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

router.delete('/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé" });
});

module.exports = router;