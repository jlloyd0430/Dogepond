import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Trending.css"; // Add appropriate styles

const TrendingTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        const response = await axios.get(`/api/token/trending?period=all&offset=0&limit=100&sortBy=volume24h&sortOrder=desc`);
        setTokens(response.data.data);
      } catch (error) {
        console.error("Error fetching trending tokens:", error);
        setError("Failed to fetch trending tokens. Please try again later.");
      }
    };
    fetchTrendingTokens();
  }, []);

  return (
    <div className="trending-container">
      <h1>Trending Tokens</h1>
      {error && <p className="error">{error}</p>}
      <div className="token-list">
        {tokens.map((token, index) => (
          <div key={index} className="token-card">
            <img src={token.pic} alt={token.tick} />
            <h2>{token.tick}</h2>
            <p>24h Volume: {token.volume24h}</p>
            <p>24h Trades: {token.trades24h}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTokens;
