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

  const formatVolume = (volume) => {
    return volume !== undefined && volume !== null ? (volume / 1e8).toFixed(2) : "0.00"; // Convert satoshis to DOGE and format to 2 decimals
  };

  const formatFloorPrice = (floorPrice) => {
    return floorPrice !== undefined && floorPrice !== null ? (floorPrice / 1e8).toFixed(2) : "N/A"; // Convert satoshis to DOGE
  };

  const renderChange = (change) => {
    if (change === undefined || change === null) {
      return <span>-</span>;
    }
    const className = change >= 0 ? "positive-change" : "negative-change";
    return <span className={className}>{change.toFixed(2)}%</span>;
  };

  return (
    <div className="trending-container">
      <h1 className="trending-title">Trending NFTs</h1>
      {error && <p className="trending-error">{error}</p>}
      <div className="trending-nft-list">
        {nfts.map((nft, index) => (
          <div key={index} className="trending-nftCard">
            <img src={nft.collection?.image} alt={nft.collection?.name} style={{ width: '150px', height: '150px' }} />
            <h2>{nft.collection?.name}</h2>
            <p>{nft.collection?.description}</p>
            <p>24h Volume: {formatVolume(nft.volume24h)} DOGE</p>
            <p>24h Trades: {nft.trades24h !== undefined ? nft.trades24h : "-"}</p>
            <p>24h Change: {renderChange(nft.change24h)}</p>
            <p>Owners: {nft.owners !== undefined ? nft.owners : "N/A"}</p>
            <p>Floor Price: {formatFloorPrice(nft.floorPrice)} DOGE</p>
            {/* Add Buy Button */}
            <button
              className="buy-button"
              onClick={() => window.location.href = `https://doggy.market/nfts/${nft.collection?.collectionId}`}
            >
              Buy {nft.collection?.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingNFTs;
