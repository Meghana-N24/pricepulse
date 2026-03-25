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
    const response = await axios.post(
      'https://api.imagga.com/v2/tags',
      `image_base64=${encodeURIComponent(base64)}`,
      {
        auth: {
          username: process.env.IMAGGA_API_KEY,
          password: process.env.IMAGGA_API_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    const tags = response.data.result.tags;
    const product = tags.slice(0, 3).map(t => t.tag.en).join(' ');
    res.json({ product });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});
 

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
// Keep alive - ping every 14 minutes
setInterval(() => {
  axios.get('https://pricepulse-backend-cujs.onrender.com/health')
    .then(() => console.log('Server kept alive'))
    .catch(() => console.log('Keep alive ping failed'));
}, 14 * 60 * 1000);