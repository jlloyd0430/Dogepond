const axios = require('axios');

module.exports = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Collection slug is required.' });
  }

  try {
    // Proxy the request to the doggy.market API
    const response = await axios.get(`https://api.doggy.market/nfts/${slug}/holders`, {
      headers: {
        // Mimic browser-like headers without unsafe ones
        'Accept': 'application/json',
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching snapshot data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch snapshot data. Please try again later.' });
  }
};
