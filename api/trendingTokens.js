const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://api.doggy.market/token/trending?period=all&offset=0&limit=100&sortBy=volume24h&sortOrder=desc');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    res.status(500).json({ error: 'Failed to fetch trending tokens. Please try again later.' });
  }
};
