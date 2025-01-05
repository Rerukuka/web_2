const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:city', async (req, res) => {
  const { city } = req.params;
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/everything?q=${city}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data.articles);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch news.' });
  }
});

module.exports = router;
