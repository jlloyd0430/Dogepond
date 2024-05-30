const mongoose = require('mongoose');
const NFTDrop = require('./models/NFTDrop');
const config = require('config');
const db = config.get('mongoURI');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected...');
    initializeLikes();
  })
  .catch(err => console.error(err));

const initializeLikes = async () => {
  try {
    const nftDrops = await NFTDrop.find({ likes: { $exists: false } });
    for (let drop of nftDrops) {
      drop.likes = [];
      await drop.save();
    }
    console.log('Likes field initialized for all documents');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};
