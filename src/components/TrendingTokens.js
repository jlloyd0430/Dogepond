import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Trending.css"; // Add appropriate styles

const TrendingTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        const response = await axios.get('/api/trendingTokens');
        setTokens(response.data.data);
      } catch (error) {
        console.error("Error fetching trending tokens:", error);
        setError("Failed to fetch trending tokens. Please try again later.");
      }
    };
    fetchTrendingTokens();
  }, []);

  const formatVolume = (volume) => {
    return volume ? (volume / 1e8).toFixed(2) : "0.00"; // Convert satoshis to DOGE and format to 2 decimals
  };

  const formatFloorPrice = (floorPrice) => {
    if (!floorPrice) return "N/A"; 
    const priceInDOGE = floorPrice / 1e8;

    // Show up to 8 decimal places for very small prices
    return priceInDOGE < 0.01 ? priceInDOGE.toFixed(8) : priceInDOGE.toFixed(2);
  };

  const renderChange = (change) => {
    const className = change >= 0 ? "positive-change" : "negative-change";
    return change !== undefined ? <span className={className}>{change.toFixed(2)}%</span> : <span>-</span>;
  };

  return (
    <div className="trending-container">
      <h1 className="trending-ttitle">Trending Tokens</h1>
      {error && <p className="trending-error">{error}</p>}
      <div className="trending-drc20-list">
        {tokens.map((token, index) => (
          <div key={index}>
            <h2>{token.tick}</h2>
            <div className="trending-drc20-card">
              <img src={token.pic} alt={token.tick} />
              <div className="trending-drci">
                <p>24h Volume: {formatVolume(token.volume24h)} DOGE</p>
                <p>24h Trades: {token.trades24h}</p>
                <p>24h Change: {renderChange(token.change24h)}</p>
                <p>Holders: {token.holders !== undefined ? token.holders : "N/A"}</p>
                <p>Floor Price: {formatFloorPrice(token.floorPrice)} DOGE</p>
                {/* Button to buy the token */}
                <button
                  className="buy-button"
                  onClick={() => window.location.href = `https://doggy.market/${token.tick}`}
                >
                  Buy {token.tick}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTokens;
