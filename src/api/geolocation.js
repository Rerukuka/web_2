const express = require('express');
const router = express.Router();

router.get('/:lat/:lon', (req, res) => {
  const { lat, lon } = req.params;
  const mapUrl = `https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

  res.json({ mapUrl });
});

module.exports = router;
