import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import { getWalletAddress, getWalletData, DOGELABS_WALLET, DOGINALS_TYPE } from "../wallets/wallets";
import apiClient from "../services/apiClient";
import Papa from 'papaparse'; // Import Papa Parse for CSV export
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
  const [snapshotData, setSnapshotData] = useState([]);
  const [collectionSlug, setCollectionSlug] = useState("");

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

  const connectWallet = async () => {
    try {
      const address = await getWalletAddress(DOGELABS_WALLET, DOGINALS_TYPE);
      setWalletAddress(address);
      fetchWalletData(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message}`);
    }
  };

  const fetchWalletData = async (address) => {
    try {
      const data = await getWalletData(address);
      setWalletBalance(data.balance);
      const filteredHoldings = data.inscriptions.filter(inscription => inscription.collection && inscription.collection.slug === COLLECTION_SLUG);
      setWalletHoldings(filteredHoldings);
      setPoints(filteredHoldings.length); // Assuming each Duck equals 1 point

      // Update points in backend
      await apiClient.post('/wallet-users/update-points', { address, points: filteredHoldings.length, nftCount: filteredHoldings.length });
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  };

  const fetchSnapshot = async () => {
    try {
      const response = await fetch(`https://dogeturbo.ordinalswallet.com/collection/${collectionSlug}/snapshot`);
      const snapshotText = await response.text();
      const parsedData = Papa.parse(snapshotText, {
        header: false,
      }).data;

      const snapshotCount = parsedData.reduce((acc, address) => {
        acc[address] = (acc[address] || 0) + 1;
        return acc;
      }, {});

      setSnapshotData(Object.entries(snapshotCount).map(([address, count]) => ({ address, count })));
    } catch (error) {
      console.error('Failed to fetch snapshot data:', error);
    }
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(snapshotData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${collectionSlug}_snapshot.csv`;
    link.click();
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
          <p>Points: {points}</p>
          {!walletAddress ? (
            <button className="connect-wallet-button" onClick={connectWallet}>Connect Wallet</button>
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
              <div className="snapshot-section">
                <h3>Snapshot Collection</h3>
                <input
                  type="text"
                  placeholder="Enter collection slug"
                  value={collectionSlug}
                  onChange={(e) => setCollectionSlug(e.target.value)}
                />
                <button onClick={fetchSnapshot}>Take Snapshot</button>
                {snapshotData.length > 0 && (
                  <div className="snapshot-results">
                    <h4>Snapshot Results</h4>
                    <ul>
                      {snapshotData.map(({ address, count }) => (
                        <li key={address}>{address}: {count}</li>
                      ))}
                    </ul>
                    <button onClick={exportToCSV}>Export to CSV</button>
                  </div>
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