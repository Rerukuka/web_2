const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:base/:target', async (req, res) => {
  const { base, target } = req.params;
  const apiKey = process.env.CURRENCY_API_KEY;
  const url = `https://api.exchangerate-api.com/v4/latest/${base}`;

  try {
    const response = await axios.get(url);
    const rate = response.data.rates[target];
    res.json({ base, target, rate });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch currency rates.' });
  }
});

module.exports = router;
