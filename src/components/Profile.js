import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getWalletAddress, DOGELABS_WALLET, MYDOGE_WALLET, DOGINALS_TYPE } from "../wallets/wallets";
import apiClient from "../services/apiClient";
import dogepondDucks from "../collections/dogepond-ducks.json"; // Importing the local JSON file
import { FaMobileAlt } from "react-icons/fa"; // Mobile icon from react-icons
import "./Profile.css";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletHoldings, setWalletHoldings] = useState([]);
  const [stakes, setStakes] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchStakes = async () => {
      try {
        const response = await apiClient.get("/api/steaks");
        const stakesData = response.data.reduce((acc, stake) => {
          acc[stake.inscriptionId] = stake;
          return acc;
        }, {});
        setStakes(stakesData);
      } catch (error) {
        console.error("Failed to fetch stakes:", error);
      }
    };

    fetchStakes();
  }, [walletAddress]);

  const connectWallet = async (walletProvider) => {
    try {
      const address = await getWalletAddress(walletProvider, DOGINALS_TYPE);
      setWalletAddress(address);
      fetchWalletData(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert(`Failed to connect wallet: ${error.message}`);
    }
  };

  const fetchWalletData = async (address) => {
    try {
      const walletData = await apiClient.get(`https://dogeturbo.ordinalswallet.com/wallet/${address}`);
      setWalletBalance(walletData.data.balance);

      const userHoldings = walletData.data.inscriptions.filter((inscription) =>
        dogepondDucks.some((duck) => duck.inscriptionId === inscription.id)
      );

      setWalletHoldings(userHoldings);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleStake = async (inscriptionId) => {
    try {
      await apiClient.post("/api/steaks/stake", {
        discordId: auth.user.discordId,
        walletAddress,
        inscriptionId,
      });
      alert("Successfully staked!");
      // Refresh stakes after staking
      const response = await apiClient.get("/api/steaks");
      setStakes(response.data.reduce((acc, stake) => {
        acc[stake.inscriptionId] = stake;
        return acc;
      }, {}));
    } catch (error) {
      console.error("Failed to stake:", error);
      alert("Failed to stake. Please try again.");
    }
  };

  const handleUnstake = async (inscriptionId) => {
    try {
      await apiClient.post("/api/steaks/unstake", {
        discordId: auth.user.discordId,
        walletAddress,
        inscriptionId,
      });
      alert("Successfully unstaked!");
      // Refresh stakes after unstaking
      const response = await apiClient.get("/api/steaks");
      setStakes(response.data.reduce((acc, stake) => {
        acc[stake.inscriptionId] = stake;
        return acc;
      }, {}));
    } catch (error) {
      console.error("Failed to unstake:", error);
      alert("Failed to unstake. Please try again.");
    }
  };

  const handleHarvest = async (inscriptionId) => {
    const stake = stakes[inscriptionId];
    if (stake && stake.points > 0) {
      alert(`You have harvested ${stake.points} points!`);
      // Reset points for the harvested stake (mocking backend behavior)
      setStakes((prev) => ({
        ...prev,
        [inscriptionId]: { ...stake, points: 0 },
      }));
    } else {
      alert("No points to harvest.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="staking-page">
        {!walletAddress ? (
          <div>
            <p> Connect wallet to view Stake-Able Assets.</p>
            <div className="wallet-buttons">
              <button className="select-wallet-button" onClick={toggleDropdown}>
                Select Wallet
              </button>
              {showDropdown && (
                <div className="wallet-dropdown">
                  <div className="dropdown-item" onClick={() => connectWallet(MYDOGE_WALLET)}>
                    <img src="/mydoge-icon.svg" alt="MyDoge Wallet" className="wallet-icon" />
                    <span>MyDoge Wallet</span>
                  </div>
                  <div className="dropdown-item" onClick={() => connectWallet(DOGELABS_WALLET)}>
                    <img src="/dogelabs.svg" alt="DogeLabs Wallet" className="wallet-icon" />
                    <span>DogeLabs Wallet</span>
                  </div>
                  <div className="dropdown-item">
                    <FaMobileAlt className="wallet-icon" />
                    <span>Mobile Connect</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p>
              Wallet Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
            </p>
            <p>Wallet Balance: {walletBalance} DOGE</p>
            <h2>My Assets</h2>
            <div className="wallet-holdings">
              {walletHoldings.length > 0 ? (
                walletHoldings.map((inscription) => {
                  const stake = stakes[inscription.id];
                  return (
                    <div key={inscription.id} className="inscription-card">
                      <img
                        src={`https://cdn.doggy.market/content/${inscription.id}`}
                        alt={`Duck ${inscription.id}`}
                      />
                      <p>Inscription ID: {inscription.id}</p>
                      <p>Points: {stake?.points || 0}</p>
                      {stake ? (
                        <>
                          <button onClick={() => handleUnstake(inscription.id)}>Unstake</button>
                          {stake.points > 0 && (
                            <button onClick={() => handleHarvest(inscription.id)}>Harvest</button>
                          )}
                        </>
                      ) : (
                        <button onClick={() => handleStake(inscription.id)}>Stake</button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No Dogepond assets or partner projects found in your wallet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
