// Profile.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import { getWalletAddress, getWalletData, DOGELABS_WALLET, MYDOGE_WALLET, DOGINALS_TYPE } from "../wallets/wallets";
import apiClient from "../services/apiClient";
// import Papa from 'papaparse'; // Import Papa Parse for CSV export
import "./Profile.css";

const COLLECTION_SLUG = 'doginal-ducks'; // Replace with your collection slug

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [userDrops, setUserDrops] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletHoldings, setWalletHoldings] = useState([]);
  const [view, setView] = useState("nftDrops"); // "nftDrops" or "wallet"
  const [error, setError] = useState("");
  const [points, setPoints] = useState(0);
  // const [snapshotData, setSnapshotData] = useState([]);
  // const [collectionSlug, setCollectionSlug] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown

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
      setIsDropdownOpen(false); // Close dropdown after selection
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message}`);
    }
  };

 
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-buttons">
        <button onClick={() => setView("nftDrops")}>My NFT Drops</button>
        <button onClick={() => setView("wallet")}>My Wallet</button>
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
                userRole={auth.user?.role} // Pass user role to the NFTCard component
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="wallet-view">
          {!walletAddress ? (
            <div className="wallet-dropdown">
              <button className="connect-wallet-button" onClick={toggleDropdown}>
                Connect Wallet
              </button>
              {isDropdownOpen && (
                <div className="wallet-dropdown-menu">
                  <button onClick={() => connectWallet(DOGELABS_WALLET)}>DogeLabs Wallet</button>
                  <button onClick={() => connectWallet(MYDOGE_WALLET)}>MyDoge Wallet</button>
                </div>
              )}
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
