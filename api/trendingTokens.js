const axios = require('axios');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');

const uri = 'mongodb+srv://jesselloyd:jesse@cluster0.bhqo1qb.mongodb.net/drc20charts?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

const fetchTokenData = async () => {
  try {
    await client.connect();
    const db = client.db('drc20charts');
    const collection = db.collection('tokenData');

    console.log("Fetching trending tokens from external API...");
    const response = await axios.get('https://api.doggy.market/token/trending?period=all&offset=0&limit=100&sortBy=volume24h&sortOrder=desc');
    const tokens = response.data.data;

    console.log("Fetched tokens from API:", tokens);

    if (tokens.length === 0) {
      console.warn("No tokens found in the API response.");
      return;
    }

    for (const token of tokens) {
      console.log(`Fetching individual sales data for token: ${token.tick}`);
      const salesResponse = await axios.get(`https://api.doggy.market/listings/tick/${token.tick}?sortBy=pricePerToken&sortOrder=asc&offset=0&limit=1000`);
      const salesData = salesResponse.data.data;

      console.log(`Fetched sales data for ${token.tick}:`, salesData);

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
              salesData: salesData // Include sales data for detailed analysis
            }
          }
        },
        { upsert: true }
      );
    }

    console.log("Token data logged successfully.");
  } catch (error) {
    console.error('Error logging token data:', error);
  } finally {
    await client.close();
  }
};

// Schedule jobs to log data at different intervals

cron.schedule('*/5 * * * *', fetchTokenData);  // Every 5 minutes
cron.schedule('*/15 * * * *', fetchTokenData); // Every 15 minutes
cron.schedule('*/30 * * * *', fetchTokenData); // Every 30 minutes
cron.schedule('0 * * * *', fetchTokenData);    // Every hour
cron.schedule('0 */2 * * *', fetchTokenData);  // Every 2 hours
cron.schedule('0 */4 * * *', fetchTokenData);  // Every 4 hours
cron.schedule('0 */12 * * *', fetchTokenData); // Every 12 hours
cron.schedule('0 0 * * *', fetchTokenData);    // Every day
cron.schedule('0 0 * * 0', fetchTokenData);    // Every week (Sunday at midnight)
cron.schedule('0 0 1 * *', fetchTokenData);    // Every month (1st at midnight)

module.exports = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('drc20charts');
    const collection = db.collection('tokenData');

    console.log("Fetching tokens from the database...");
    const tokens = await collection.find({}).toArray();
    console.log("Tokens fetched from database:", tokens);

    if (tokens.length === 0) {
      console.warn("No tokens found in the database.");
    }

    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error fetching trending tokens from database:', error);
    res.status(500).json({ error: 'Failed to fetch trending tokens. Please try again later.' });
  } finally {
    await client.close();
  }
};
