const axios = require('axios');

module.exports = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Collection slug is required.' });
  }

  try {
    const response = await axios.get(`https://api.doggy.market/nfts/${slug}/holders`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching snapshot data:', error);
    res.status(500).json({ error: 'Failed to fetch snapshot data. Please try again later.' });
  }
};
