import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Trending.css"; // Add appropriate styles

const TrendingNFTs = () => {
  const [nfts, setNFTs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingNFTs = async () => {
      try {
        const response = await axios.get('/api/trendingNFTs');
        setNFTs(response.data);
      } catch (error) {
        console.error("Error fetching trending NFTs:", error);
        setError("Failed to fetch trending NFTs. Please try again later.");
      }
    };
    fetchTrendingNFTs();
  }, []);

  return (
    <div className="trending-container">
      <h1 className="ttitle">Trending NFTs</h1>
      {error && <p className="error">{error}</p>}
      <div className="nft-list">
        {nfts.map((nft, index) => (
          <div key={index} className="nftCard">
            <img src={nft.collection.image} alt={nft.collection.name} style={{ width: '150px', height: '150px' }} />
            <h2>{nft.collection.name}</h2>
            <p>{nft.collection.description}</p>
            <p>24h Volume: {nft.volume24h}</p>
            <p>24h Trades: {nft.trades24h}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingNFTs;
