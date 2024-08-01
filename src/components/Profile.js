import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import { getWalletAddress, getWalletData, DOGELABS_WALLET, MYDOGE_WALLET, DOGINALS_TYPE } from "../wallets/wallets";
import apiClient from "../services/apiClient";
import Papa from 'papaparse';
import "./Profile.css";

const COLLECTION_SLUG = 'doginal-ducks';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [userDrops, setUserDrops] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletHoldings, setWalletHoldings] = useState([]);
  const [view, setView] = useState("nftDrops");
  const [error, setError] = useState("");
  const [points, setPoints] = useState(0);
  const [snapshotData, setSnapshotData] = useState([]);
  const [collectionSlug, setCollectionSlug] = useState("");
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  useEffect(() => {
    const fetchUserDrops = async () => {
      try {
        const config = {
          headers: {
            "x-auth-token": auth.token,
          },
        };
        const response = await apiClient.get("/nftdrops/user", config);
        setUserDrops(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching user NFT drops:", error);
        setError("Failed to fetch user NFT drops. Please try again later.");
      }
    };

    const fetchUserPoints = async () => {
      try {
        const response = await apiClient.get(`/wallet-users/${auth.user.id}`);
        setPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching user points:", error);
        setError("Failed to fetch user points. Please try again later.");
      }
    };

    if (view === "nftDrops") {
      fetchUserDrops();
    }
    if (auth.user) {
      fetchUserPoints();
    }
  }, [auth.token, view, auth.user]);

  const connectWallet = async (walletProvider) => {
    try {
      const address = await getWalletAddress(walletProvider, DOGINALS_TYPE);
      setWalletAddress(address);
      fetchWalletData(address, walletProvider);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message}`);
    }
  };

  const fetchWalletData = async (address, walletProvider) => {
    try {
      const data = await getWalletData(address, walletProvider);
      setWalletBalance(data.balance);
      const filteredHoldings = data.inscriptions.filter(inscription => inscription.collection && inscription.collection.slug === COLLECTION_SLUG);
      setWalletHoldings(filteredHoldings);
      setPoints(filteredHoldings.length);

      await apiClient.post('/wallet-users/update-points', { address, points: filteredHoldings.length, nftCount: filteredHoldings.length });
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  };

  const handleWalletButtonClick = () => {
    setShowWalletDropdown(prev => !prev);
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-buttons">
        <button onClick={() => setView("nftDrops")}>My NFT Drops</button>
        <div className="wallet-dropdown">
          <button onClick={handleWalletButtonClick}>Connect Wallet</button>
          {showWalletDropdown && (
          <div className="dropdown-content">
          <div className="dropdown-item" onClick={() => connectWallet(DOGELABS_WALLET)}>
            <img src="/dogelabs.svg" alt="DogeLabs" className="wallet-icon" />
            <span>DogeLabs Wallet</span>
          </div>
          <div className="dropdown-item" onClick={() => connectWallet(MYDOGE_WALLET)}>
            <img src="/mydoge-icon.svg" alt="MyDoge" className="wallet-icon" />
            <span>MyDoge Wallet</span>
          </div>
        </div>
        
          )}
        </div>
      </div>
      {view === "nftDrops" ? (
        <div>
          <h2>My NFT Drops</h2>
          {error && <p>{error}</p>}
          <div className="nft-drops">
            {userDrops.map((drop) => (
              <NFTCard
                key={drop._id}
                drop={drop}
                onLike={() => {}}
                isProfilePage={true}
                userRole={auth.user?.role}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="wallet-view">
          {!walletAddress ? (
            <div>
              <p>Please connect a wallet to view your holdings.</p>
            </div>
          ) : (
            <div>
              <p>Wallet Address: {walletAddress}</p>
              <p>Wallet Balance: {walletBalance} DOGE</p>
              <h2>My Doginal Ducks</h2>
              <div className="wallet-holdings">
                {walletHoldings.map((inscription) => (
                  <div key={inscription.id} className="inscription-card">
                    <img src={`https://dogecdn.ordinalswallet.com/inscription/content/${inscription.id}`} alt={inscription.meta.name} />
                    <p>{inscription.meta.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
