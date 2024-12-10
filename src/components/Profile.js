import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import { getWalletAddress, DOGELABS_WALLET, MYDOGE_WALLET, DOGINALS_TYPE } from "../wallets/wallets";
import apiClient from "../services/apiClient";
import dogepondDucks from "../collections/dogepond-ducks.json"; // Importing the local JSON file
import "./Profile.css";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [userDrops, setUserDrops] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletHoldings, setWalletHoldings] = useState([]);
  const [view, setView] = useState("nftDrops");
  const [error, setError] = useState("");
  const [points, setPoints] = useState(0);

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
      } catch (error) {
        console.error("Error fetching user NFT drops:", error);
        setError("Failed to fetch user NFT drops. Please try again later.");
      }
    };

    if (view === "nftDrops") {
      fetchUserDrops();
    }
  }, [auth.token, view]);

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
      // Fetch wallet balance and inscriptions
      const walletData = await apiClient.get(`https://dogeturbo.ordinalswallet.com/wallet/${address}`);
      setWalletBalance(walletData.data.balance);

      // Filter user's inscriptions for Dogepond Ducks
      const userHoldings = walletData.data.inscriptions.map((inscription) => {
        const duck = dogepondDucks.find((duck) => duck.inscriptionId === inscription.id);
        return duck ? { ...duck, id: inscription.id } : null;
      }).filter(Boolean);

      setWalletHoldings(userHoldings);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  };

  const handleStake = async (inscriptionId) => {
    try {
      const response = await apiClient.post("/steaks/stake", {
        discordId: auth.user.discordId,
        walletAddress,
        inscriptionId,
      });
      alert(response.data.message);
      fetchWalletData(walletAddress); // Refresh wallet data
    } catch (error) {
      console.error("Failed to stake:", error);
      alert("Failed to stake inscription.");
    }
  };

  const handleUnstake = async (inscriptionId) => {
    try {
      const response = await apiClient.post("/steaks/unstake", {
        discordId: auth.user.discordId,
        walletAddress,
        inscriptionId,
      });
      alert(response.data.message);
      fetchWalletData(walletAddress); // Refresh wallet data
    } catch (error) {
      console.error("Failed to unstake:", error);
      alert("Failed to unstake inscription.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-buttons">
        <button onClick={() => setView("nftDrops")}>My NFT Drops</button>
        <button onClick={() => setView("staking")}>Staking</button>
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
        <div className="staking-page">
          {!walletAddress ? (
            <div>
              <p>Please connect your wallet to view your Dogepond Ducks.</p>
              <div className="wallet-buttons">
                <button onClick={() => connectWallet(DOGELABS_WALLET)}>Connect DogeLabs Wallet</button>
                <button onClick={() => connectWallet(MYDOGE_WALLET)}>Connect MyDoge Wallet</button>
              </div>
            </div>
          ) : (
            <div>
              <p>Wallet Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}</p>
              <p>Wallet Balance: {walletBalance} DOGE</p>
              <h2>My Dogepond Ducks</h2>
              <div className="wallet-holdings">
                {walletHoldings.length > 0 ? (
                  walletHoldings.map((inscription) => (
                    <div key={inscription.id} className="inscription-card">
                      <img
                        src={`https://cdn.doggy.market/content/${inscription.id}`}
                        alt={`Duck ${inscription.id}`}
                      />
                      <p>Name: {inscription.name}</p>
                      <p>Inscription ID: {inscription.id}</p>
                      p>DUNE: DUCKS•WIF•HAT </p>
                      <p>Amount Earned: {inscription.points || 0}</p>
                      {inscription.isStaked ? (
                        <button onClick={() => handleUnstake(inscription.id)}>Unstake</button>
                      ) : (
                        <button onClick={() => handleStake(inscription.id)}>Stake</button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No Dogepond Ducks found in your wallet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
