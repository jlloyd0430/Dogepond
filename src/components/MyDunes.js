import React, { useState } from "react";
import axios from "axios";
import "./Trending.css"; // Use the same stylesheet for consistent styling

const MyDunes = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletDunes, setWalletDunes] = useState([]);
  const [balanceError, setBalanceError] = useState("");

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleFetchBalance = async () => {
    if (!walletAddress) {
      setBalanceError("Please enter a wallet address.");
      return;
    }
    try {
      const response = await axios.get(`https://wonky-ord.dogeord.io/dunes/balance/${walletAddress}?show_all=true`);
      setWalletDunes(response.data.dunes);
      setBalanceError("");
    } catch (error) {
      console.error(`Error fetching dunes for wallet ${walletAddress}:`, error);
      setBalanceError("Failed to fetch dunes balance. Please try again later.");
    }
  };

  return (
    <div className="trending-container"> {/* Reusing the same container style */}
      <h1 className="trending-ttitle">My Dunes</h1>
      <div className="trending-balance-container"> {/* Reusing balance container style */}
        <input
          type="text"
          placeholder="Enter wallet address..."
          value={walletAddress}
          onChange={handleWalletAddressChange}
          className="trending-search-input"  {/* Reusing input style */}
        />
        <button onClick={handleFetchBalance}>Check Balance</button>
      </div>
      {balanceError && <p className="trending-error">{balanceError}</p>} {/* Reusing error style */}
      {walletDunes.length > 0 && (
        <div className="trending-dune-list"> {/* Reusing list style */}
          {walletDunes.map((dune, index) => (
            <div key={index} className="trending-dune-card"> {/* Reusing card style */}
              <p>{dune.dune} ({dune.symbol}): {dune.total_balance / (10 ** dune.divisibility)} {dune.symbol}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDunes;
