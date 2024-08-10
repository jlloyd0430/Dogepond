import React, { useState } from "react";
import axios from "axios";
import "./Trending.css"; // Add appropriate styles

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
    <div className="my-dunes-container">
      <h1>My Dunes</h1>
      <div className="my-dunes-balance-container">
        <input
          type="text"
          placeholder="Enter wallet address..."
          value={walletAddress}
          onChange={handleWalletAddressChange}
        />
        <button onClick={handleFetchBalance}>Check Balance</button>
      </div>
      {balanceError && <p className="my-dunes-error">{balanceError}</p>}
      {walletDunes.length > 0 && (
        <div className="my-dunes-list">
          {walletDunes.map((dune, index) => (
            <div key={index} className="my-dune-card">
              <p>{dune.dune} ({dune.symbol}): {dune.total_balance / (10 ** dune.divisibility)} {dune.symbol}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDunes;

