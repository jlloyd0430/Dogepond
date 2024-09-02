const axios = require('axios');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');

const uri = 'mongodb+srv://jesselloyd:jesse@cluster0.bhqo1qb.mongodb.net/drc20charts?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

const logTokenData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('drc20charts');
    const collection = db.collection('tokenData');

    console.log("Fetching token data from API...");
    const response = await axios.get('https://api.doggy.market/token/trending?period=all&offset=0&limit=100&sortBy=volume24h&sortOrder=desc');
    const tokens = response.data.data;

    console.log("Token data fetched. Updating MongoDB...");
    for (const token of tokens) {
      console.log(`Updating token: ${token.tick}`);
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

    console.log("Token data update completed.");
  } catch (error) {
    console.error('Error logging token data:', error);
  } finally {
    console.log("Closing MongoDB connection...");
    await client.close();
    console.log("MongoDB connection closed.");
  }
};

// Schedule jobs to log data at different intervals

// Every 5 minutes
cron.schedule('*/5 * * * *', logTokenData);

// Every 15 minutes
cron.schedule('*/15 * * * *', logTokenData);

// Every 30 minutes
cron.schedule('*/30 * * * *', logTokenData);

// Every hour
cron.schedule('0 * * * *', logTokenData);

// Every 2 hours
cron.schedule('0 */2 * * *', logTokenData);

// Every 4 hours
cron.schedule('0 */4 * * *', logTokenData);

// Every 12 hours
cron.schedule('0 */12 * * *', logTokenData);

// Every day
cron.schedule('0 0 * * *', logTokenData);

// Every week (on Sunday at midnight)
cron.schedule('0 0 * * 0', logTokenData);

// Every month (on the 1st at midnight)
cron.schedule('0 0 1 * *', logTokenData);

module.exports = async (req, res) => {
  try {
    console.log("Connecting to MongoDB for API request...");
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('drc20charts');
    const collection = db.collection('tokenData');

    console.log("Fetching tokens from MongoDB...");
    const tokens = await collection.find({}).toArray();
    console.log("Tokens fetched from MongoDB:", tokens);

    res.status(200).json(tokens);
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    res.status(500).json({ error: 'Failed to fetch trending tokens. Please try again later.' });
  } finally {
    console.log("Closing MongoDB connection...");
    await client.close();
    console.log("MongoDB connection closed.");
  }
};
