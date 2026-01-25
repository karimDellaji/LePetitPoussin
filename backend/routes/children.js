const express = require('express');
const router = express.Router();

// Route test pour voir les enfants
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: "Test Enfant", age: 4, status: "Présent" }
  ]);
});

module.exports = router;