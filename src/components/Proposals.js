const express = require('express');
const axios = require('axios');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Vote = require('../models/Votes');
const Snapshot = require('../models/Snapshot');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

// Configure AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer-S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now().toString()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

// Create a new proposal
router.post('/create', upload.single('image'), async (req, res) => {
  const { name, description, options, endDate, collectionName, weightInputs, walletAddress } = req.body;
  const image = req.file ? req.file.location : null; // Store URL of the image

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet must be connected.' });
  }

  if (!collectionName) {
    return res.status(400).json({ error: 'Collection name is required.' });
  }

  try {
    // Take a snapshot of the collection
    const snapshotResponse = await axios.get(`https://dogeturbo.ordinalswallet.com/collection/${collectionName}/snapshot`);
    const snapshot = snapshotResponse.data.split('\n').filter(address => address.trim());

    // Count the occurrences of each address in the snapshot
    const addressCounts = snapshot.reduce((acc, address) => {
      const normalizedAddress = address.trim(); // Ensure addresses are trimmed and normalized
      if (normalizedAddress) {
        acc[normalizedAddress] = (acc[normalizedAddress] || 0) + 1;
      }
      return acc;
    }, {});

    // Check if the connected wallet address is in the snapshot
    const normalizedWalletAddress = walletAddress.trim();
    if (!addressCounts[normalizedWalletAddress]) {
      return res.status(403).json({ error: 'You must hold an NFT from this collection to create a proposal.' });
    }

    const proposal = new Proposal({
      name,
      description,
      options,
      endDate,
      collectionName,
      weightInputs,
      image, // Include the image URL
      votes: [],
    });

    await proposal.save();

    const snapshotDoc = new Snapshot({
      proposalId: proposal._id,
      collectionName,
      addressCounts,
    });

    await snapshotDoc.save();

    res.status(201).json(proposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const proposals = await Proposal.find().populate('votes');
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get a specific proposal by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const proposal = await Proposal.findById(id).populate('votes');
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found.' });
    }
    res.status(200).json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ message: 'An error occurred while fetching the proposal.', error });
  }
});

// Function to calculate the winning option
const calculateWinningOption = (votes, options) => {
  const optionCounts = options.reduce((acc, option) => {
    acc[option] = 0;
    return acc;
  }, {});

  votes.forEach(vote => {
    if (optionCounts[vote.option] !== undefined) {
      optionCounts[vote.option] += vote.weight;
    }
  });

  return Object.keys(optionCounts).reduce((a, b) => (optionCounts[a] > optionCounts[b] ? a : b));
};

// Vote on a proposal
router.post('/vote', async (req, res) => {
  const { proposalId, walletAddress, option } = req.body;

  console.log('Received vote request:', req.body);

  if (!proposalId || !walletAddress || !option) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found.' });
    }

    const currentTime = new Date();
    if (currentTime > new Date(proposal.endDate)) {
      const winningOption = calculateWinningOption(proposal.votes, proposal.options);
      return res.status(400).json({ message: `Voting has ended. The winning option is ${winningOption}.` });
    }

    const existingVote = await Vote.findOne({ proposalId, walletAddress: walletAddress.trim() });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted.' });
    }

    const snapshot = await Snapshot.findOne({ proposalId });
    if (!snapshot) {
      return res.status(404).json({ message: 'Snapshot not found.' });
    }

    console.log(`Snapshot address counts: ${JSON.stringify(snapshot.addressCounts)}`);

    const normalizedWalletAddress = walletAddress.trim(); // Normalize the wallet address
    const nftCount = snapshot.addressCounts[normalizedWalletAddress];
    if (!nftCount) {
      return res.status(403).json({ message: 'No eligible NFTs found in the wallet.' });
    }

    const vote = new Vote({
      proposalId,
      walletAddress: normalizedWalletAddress,
      weight: nftCount, // Use the weight from snapshot
      nftCount: nftCount, // Use the count from snapshot
      option,
      createdAt: new Date()
    });
    await vote.save();

    proposal.votes.push(vote);
    await proposal.save();

    res.status(200).json({ message: 'Vote recorded successfully.' });
  } catch (error) {
    console.error('Error voting on proposal:', error);
    res.status(500).json({ message: 'An error occurred while voting on the proposal.', error });
  }
});

module.exports = router;
