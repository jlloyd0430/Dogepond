const axios = require('axios');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://jesselloyd:jesse@cluster0.bhqo1qb.mongodb.net/drc20charts?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('drc20charts');
    const collection = db.collection('tokenData');

    const response = await axios.get('https://api.doggy.market/token/trending?period=all&offset=0&limit=100&sortBy=volume24h&sortOrder=desc');
    const tokens = response.data.data;

    for (const token of tokens) {
      // Add historical data to the document
      await collection.updateOne(
        { tick: token.tick },
        {
          $set: {
            inscriptionId: token.inscriptionId,
            tick: token.tick,
            pic: token.pic,
            twitterUrl: token.twitterUrl,
            websiteUrl: token.websiteUrl,
            max: token.max,
            lim: token.lim,
            dec: token.dec,
            holders: token.holders,
            mints: token.mints,
            transfers: token.transfers,
            deployedAt: token.deployedAt,
            deployedBlockHeight: token.deployedBlockHeight,
            deployerAddress: token.deployerAddress,
            mintedAmt: token.mintedAmt,
            firstPrice: token.firstPrice,
            lastPrice: token.lastPrice,
            marketcap: token.marketcap,
            floorPrice: token.floorPrice,
            listings: token.listings,
          },
          $push: {
            historicalData: {
              timestamp: new Date(),
              volume24h: token.volume24h,
              volume7d: token.volume7d,
              trades24h: token.trades24h,
              trades7d: token.trades7d,
              change24h: token.change24h,
              change7d: token.change7d,
            }
          }
        },
        { upsert: true }
      );
    }

    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    res.status(500).json({ error: 'Failed to fetch trending tokens. Please try again later.' });
  } finally {
    await client.close();
  }
};
