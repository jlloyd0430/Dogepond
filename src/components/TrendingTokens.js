import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Trending.css"; // Add appropriate styles

const TrendingTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [timeframe, setTimeframe] = useState('5'); // Default to 5-minute chart

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        const response = await axios.get('/api/trendingTokens');
        setTokens(response.data);
      } catch (error) {
        console.error("Error fetching trending tokens:", error);
        setError("Failed to fetch trending tokens. Please try again later.");
      }
    };
    fetchTrendingTokens();
  }, []);

  useEffect(() => {
    if (selectedToken && window.TradingView) {
      // Clear any existing chart before rendering a new one
      document.getElementById("tradingview_chart").innerHTML = "";

      // Load TradingView widget for the selected token with the selected timeframe
      new window.TradingView.widget({
        "container_id": "tradingview_chart",
        "autosize": true,
        "symbol": selectedToken.tick, // This should match the symbol used by your data provider
        "interval": timeframe,
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": false,
        "studies": [
          "MACD@tv-basicstudies",
          "StochasticRSI@tv-basicstudies"
        ],
        "hideideas": true
      });
    }
  }, [selectedToken, timeframe]);

  const formatVolume = (volume) => {
    return volume ? (volume / 1e8).toFixed(2) : "0.00"; // Convert satoshis to DOGE and format to 2 decimals
  };

  const renderChange = (change) => {
    const className = change >= 0 ? "positive-change" : "negative-change";
    return change !== undefined ? <span className={className}>{change.toFixed(2)}%</span> : <span>-</span>;
  };

  return (
    <div className="trending-container">
      <h1 className="trending-title">Trending Tokens</h1>
      {error && <p className="trending-error">{error}</p>}
      <div className="trending-drc20-list">
        {tokens.map((token, index) => (
          <div key={index} onClick={() => setSelectedToken(token)}>
            <h2>{token.tick}</h2>
            <div className="trending-drc20-card">
              <img src={token.pic} alt={token.tick} />
              <div className="trending-drci">
                <p>24h Volume: {formatVolume(token.volume24h)} DOGE</p>
                <p>24h Trades: {token.trades24h}</p>
                <p>24h Change: {renderChange(token.change24h)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedToken && (
        <div>
          <div className="timeframe-selector">
            <button onClick={() => setTimeframe('5')}>5m</button>
            <button onClick={() => setTimeframe('15')}>15m</button>
            <button onClick={() => setTimeframe('30')}>30m</button>
            <button onClick={() => setTimeframe('60')}>1H</button>
            <button onClick={() => setTimeframe('120')}>2H</button>
            <button onClick={() => setTimeframe('240')}>4H</button>
            <button onClick={() => setTimeframe('720')}>12H</button>
            <button onClick={() => setTimeframe('D')}>1D</button>
            <button onClick={() => setTimeframe('W')}>1W</button>
            <button onClick={() => setTimeframe('M')}>1M</button>
          </div>
          <div id="tradingview_chart" style={{ width: "100%", height: "500px", marginTop: "20px" }}>
            {/* TradingView chart will be rendered here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingTokens;
