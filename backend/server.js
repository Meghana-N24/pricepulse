const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'alive' });
});

// Product search
app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get('https://real-time-product-search.p.rapidapi.com/search-v2', {
      params: {
        q: query,
        country: 'in',
        language: 'en',
        page: '1',
        limit: '10',
        sort_by: 'BEST_MATCH',
        product_condition: 'ANY',
        return_filters: 'true'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

// Image search
app.post('/image-search', async (req, res) => {
  const { base64, mediaType } = req.body;
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: 'What product is in this image? Reply with just the product name in 3-5 words, nothing else.' }
        ]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      }
    });
    const product = response.data.content[0].text;
    res.json({ product });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Image search failed' });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});