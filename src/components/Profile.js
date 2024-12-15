import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import { getWalletAddress, DOGELABS_WALLET, MYDOGE_WALLET, DOGINALS_TYPE } from "../wallets/wallets";
import apiClient from "../services/apiClient";
import { verifyMobileWallet } from "../services/duneApiClient";
import dogepondDucks from "../collections/dogepond-ducks.json"; // Importing the local JSON file
import { FaMobileAlt } from "react-icons/fa"; // Mobile icon from react-icons
import "./Profile.css";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [userDrops, setUserDrops] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletHoldings, setWalletHoldings] = useState([]);
  const [stakes, setStakes] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [view, setView] = useState("nftDrops"); // State to toggle between views
  const [error, setError] = useState("");
  const [mobileVerification, setMobileVerification] = useState(false);
  const [tempAddress, setTempAddress] = useState("");
  const [randomAmount, setRandomAmount] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  // Fetch user's NFT drops
  useEffect(() => {
    if (view === "nftDrops") {
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
      fetchUserDrops();
    }
  }, [auth.token, view]);

  // Fetch stakes from the database
  useEffect(() => {
    const fetchStakes = async () => {
      try {
        const response = await apiClient.get("/steaks");
        const stakesData = response.data.reduce((acc, stake) => {
          acc[stake.inscriptionId] = stake;
          return acc;
        }, {});
        setStakes(stakesData);
      } catch (error) {
        console.error("Failed to fetch stakes:", error);
      }
    };

    if (view === "staking") {
      fetchStakes();
    }
  }, [walletAddress, view]);

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
      const balance = walletData.data.confirmed_balance || 0;
      setWalletBalance((balance / 100000000).toFixed(8)); // Convert to DOGE with decimals

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

  const startMobileVerification = async () => {
  if (!tempAddress) {
    alert("Please enter a wallet address.");
    return;
  }

  setVerificationMessage("Generating verification amount...");
  setIsVerifying(true);

  try {
    // First, fetch the DOGE amount immediately
    const response = await verifyMobileWallet(tempAddress);

    if (response.amount) {
      setRandomAmount(response.amount); // Show amount immediately
      setVerificationMessage(`Send exactly ${response.amount} DOGE to your wallet address: ${tempAddress}.`);
    }

    // Continue checking for payment verification
    if (response.success) {
      setWalletAddress(tempAddress); // Set connected wallet
      await fetchWalletData(tempAddress); // Fetch wallet data
      setVerificationMessage(""); // Clear messages after success
      setMobileVerification(false);
    } else {
      setVerificationMessage(response.message || "Verification failed. Please try again.");
    }
  } catch (error) {
    console.error("Verification failed:", error.message);
    setVerificationMessage("Verification failed. Please try again.");
  } finally {
    setIsVerifying(false);
  }
};

  const handleStake = async (inscriptionId) => {
    try {
      await apiClient.post("/steaks/stake", {
        discordId: auth.user.discordId,
        walletAddress,
        inscriptionId,
      });
      alert("Successfully staked!");
      const response = await apiClient.get("/steaks");
      setStakes(
        response.data.reduce((acc, stake) => {
          acc[stake.inscriptionId] = stake;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Failed to stake:", error);
      alert("Failed to stake. Please try again.");
    }
  };

  const handleUnstake = async (inscriptionId) => {
    try {
      await apiClient.post("/steaks/unstake", {
        discordId: auth.user.discordId,
        walletAddress,
        inscriptionId,
      });
      alert("Successfully unstaked!");
      const response = await apiClient.get("/steaks");
      setStakes(
        response.data.reduce((acc, stake) => {
          acc[stake.inscriptionId] = stake;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Failed to unstake:", error);
      alert("Failed to unstake. Please try again.");
    }
  };

  const handleHarvest = async (inscriptionId) => {
    const stake = stakes[inscriptionId];
    if (stake && stake.points > 0) {
      try {
        const response = await apiClient.post("/harvest", {
          walletAddress,
          inscriptionId,
          duneName: "DUCKS•WIF•HAT", // Replace with the actual dune name
        });

        alert(response.data.message);
        // Reset the points locally
        setStakes((prev) => ({
          ...prev,
          [inscriptionId]: { ...stake, points: 0 },
        }));
      } catch (error) {
        console.error("Failed to harvest:", error);
        alert("Failed to harvest. Please try again.");
      }
    } else {
      alert("No points to harvest.");
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
              <p>Connect wallet to view Stake-Able Assets.</p>
              <div className="wallet-buttons">
                <button
                  className="select-wallet-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Select Wallet
                </button>
                {showDropdown && (
                  <div className="wallet-dropdown">
                    <div
                      className="dropdown-item"
                      onClick={() => connectWallet(MYDOGE_WALLET)}
                    >
                      <img
                        src="/mydoge-icon.svg"
                        alt="MyDoge Wallet"
                        className="wallet-icon"
                      />
                      <span>MyDoge Wallet</span>
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => connectWallet(DOGELABS_WALLET)}
                    >
                      <img
                        src="/dogelabs.svg"
                        alt="DogeLabs Wallet"
                        className="wallet-icon"
                      />
                      <span>DogeLabs Wallet</span>
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => setMobileVerification(true)}
                    >
                      <FaMobileAlt className="wallet-icon" />
                      <span>Mobile Connect</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Verification */}
              {mobileVerification && (
                <div className="mobile-verification">
                  <h2>Mobile Verification</h2>
                  <p>Enter your wallet address for verification:</p>
                  <input
                    type="text"
                    placeholder="Enter wallet address"
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                  />
                  <button onClick={startMobileVerification}>Verify</button>
                  {randomAmount && (
                    <div>
                      <p>
                        Send <b>{randomAmount} DOGE</b> to your own address.
                      </p>
                      <p>Address: {tempAddress}</p>
                    </div>
                  )}
                  {isVerifying && <p>Verifying transaction... Please wait.</p>}
                  {verificationMessage && <p>{verificationMessage}</p>}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>
                Wallet Address: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-6)}
              </p>
              <p>Wallet Balance: {walletBalance} DOGE</p>
              <h2>My Assets</h2>
              <div className="wallet-holdings">
                {walletHoldings.length > 0 ? (
                  walletHoldings.map((inscription) => (
                    <div key={inscription.id} className="inscription-card">
                      <img
                        src={`https://cdn.doggy.market/content/${inscription.id}`}
                        alt={`Duck ${inscription.id}`}
                      />
                      <p>Inscription ID: {inscription.id}</p>
                    </div>
                  ))
                ) : (
                  <p>No Dogepond assets or partner projects found in your wallet.</p>
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
