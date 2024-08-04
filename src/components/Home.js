import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import apiClient from "../services/apiClient";
import AdBannerCarousel from "../components/AdBannerCarousel";
import DiscordBotInvite from "../components/discordBotInvite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import TrendingDunes from "../components/TrendingDunes";
import TrendingTokens from "../components/TrendingTokens";
import TrendingNFTs from "../components/TrendingNFTs";
import axios from "axios"; // Import axios

const Home = () => {
  const [approvedDrops, setApprovedDrops] = useState([]);
  const [filteredDrops, setFilteredDrops] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("mostLiked");
  const [dropType, setDropType] = useState("");
  const { auth } = useContext(AuthContext);

  // State for managing active tab and dropdown visibility
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropTypeDropdown, setShowDropTypeDropdown] = useState(false);

  // State for snapshot functionality
  const [collectionSlug, setCollectionSlug] = useState("");
  const [snapshotData, setSnapshotData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for DRC-20 snapshot
  const [ticker, setTicker] = useState("");
  const [drc20Holders, setDrc20Holders] = useState([]);
  const [drc20Cursor, setDrc20Cursor] = useState(null);
  const [drc20Loading, setDrc20Loading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = auth.token
          ? {
              headers: {
                "x-auth-token": auth.token,
              },
            }
          : {};
        const result = await apiClient.get("/nftdrops/approved", config);
        setApprovedDrops(result.data);
        setError("");
      } catch (error) {
        setError("Failed to fetch approved NFT drops. Please try again later.");
      }
    };
    fetchData();
  }, [auth.token]);

  useEffect(() => {
    if (activeTab === "upcoming") {
      applyFilter();
    }
  }, [searchQuery, approvedDrops, filter, dropType, activeTab]);

  const applyFilter = () => {
    const currentDate = new Date();
    let filtered = approvedDrops.filter(
      (drop) =>
        drop.projectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (dropType === "" || drop.dropType === dropType) &&
        ((filter === "upcoming" && new Date(drop.date) >= currentDate) ||
          (filter === "past" && new Date(drop.date) < currentDate) ||
          filter === "mostRecent" ||
          filter === "mostLiked")
    );

    if (filter === "mostLiked") {
      filtered.sort((a, b) => b.likes.length - a.likes.length);
    } else if (filter === "mostRecent") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredDrops(filtered);
  };

  const handleLike = async (id) => {
    try {
      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };
      const response = await apiClient.post(`/nftdrops/${id}/like`, {}, config);
      setApprovedDrops((prevDrops) =>
        prevDrops.map((drop) => (drop._id === id ? response.data : drop))
      );
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
    setShowDropdown(false); // Close dropdown after selection
  };

  const handleDropTypeChange = (type) => {
    setDropType(type);
    setShowDropTypeDropdown(false); // Close dropdown after selection
  };

  // Snapshot functions
  const fetchSnapshot = async () => {
    try {
      const response = await fetch(`https://dogeturbo.ordinalswallet.com/collection/${collectionSlug}/snapshot`);
      const snapshotText = await response.text();
      const parsedData = snapshotText.split('\n').filter(line => line).map(line => [line.trim()]);

      const snapshotCount = parsedData.reduce((acc, [address]) => {
        acc[address] = (acc[address] || 0) + 1;
        return acc;
      }, {});

      setSnapshotData(Object.entries(snapshotCount).map(([address, count]) => ({ address, count })));
    } catch (error) {
      console.error('Failed to fetch snapshot data:', error);
    }
  };

  const exportToTXT = () => {
    const txt = snapshotData.map(({ address, count }) => `${address}: ${count}`).join('\n');
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${collectionSlug}_snapshot.txt`;
    link.click();
  };

  const exportToJSON = () => {
    const json = JSON.stringify(snapshotData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${collectionSlug}_snapshot.json`;
    link.click();
  };

  // DRC-20 Snapshot functions
 const fetchDrc20Snapshot = async () => {
  try {
    setDrc20Loading(true);
    let allHolders = [];
    let cursor = null;

    do {
      const response = await fetch(
        `https://xdg-mainnet.gomaestro-api.org/v0/assets/drc20/${ticker}/holders${
          cursor ? `?cursor=${cursor}` : ""
        }`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      const data = await response.json();
      allHolders = [...allHolders, ...data.data];

      cursor = data.next_cursor;
    } while (cursor);

    setDrc20Holders(allHolders);
    setDrc20Loading(false);
  } catch (error) {
    console.error("Failed to fetch DRC-20 holders:", error);
    setDrc20Loading(false);
  }
};


  const exportDrc20ToTXT = () => {
    const txt = drc20Holders.map(({ address, balance }) => `${address}: ${balance}`).join('\n');
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${ticker}_drc20_snapshot.txt`;
    link.click();
  };

  return (
    <div>
      <div className="ads">
        <AdBannerCarousel />
        <div className="tabs-container">
          <button
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            Drops
          </button>
          <button
            className={activeTab === "dunes" ? "active" : ""}
            onClick={() => setActiveTab("dunes")}
          >
            Dunes
          </button>
          <button
            className={activeTab === "drc20" ? "active" : ""}
            onClick={() => setActiveTab("drc20")}
          >
            DRC-20
          </button>
          <button
            className={activeTab === "nfts" ? "active" : ""}
            onClick={() => setActiveTab("nfts")}
          >
            NFTs
          </button>
        </div>
      </div>
      {activeTab === "upcoming" && (
        <div className="search-filter-container">
          <div className="filter-dropdown">
            <FontAwesomeIcon
              className="search"
              icon={faFilter}
              onClick={() => setShowDropTypeDropdown(!showDropTypeDropdown)}
            />
            {showDropTypeDropdown && (
              <div className="dropdown-menu-1">
                <div onClick={() => handleDropTypeChange("")}>All Types</div>
                <div onClick={() => handleDropTypeChange("new mint")}>
                  New Mint
                </div>
                <div onClick={() => handleDropTypeChange("airdrop")}>Airdrop</div>
                <div onClick={() => handleDropTypeChange("auction")}>Auction</div>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Search by project name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="filter-dropdown">
            <FontAwesomeIcon
              className="search"
              icon={faFilter}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <div onClick={() => handleFilterChange("upcoming")}>
                  Upcoming Drops
                </div>
                <div onClick={() => handleFilterChange("past")}>Past Drops</div>
                <div onClick={() => handleFilterChange("mostRecent")}>
                  Most Recent
                </div>
                <div onClick={() => handleFilterChange("mostLiked")}>
                  Top Voted
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="main-content">
        {activeTab === "upcoming" ? (
          <div className="card">
            {error && <p>{error}</p>}
            {filteredDrops.length > 0 ? (
              filteredDrops.map((drop) => (
                <NFTCard
                  key={drop._id}
                  drop={drop}
                  onLike={() => handleLike(drop._id)}
                  onApprove={null}
                  userId={auth.user?.id}
                  isProfilePage={false}
                />
              ))
            ) : (
              <p>No approved NFT drops found.</p>
            )}
          </div>
        ) : activeTab === "dunes" ? (
          <TrendingDunes />
        ) : activeTab === "drc20" ? (
          <TrendingTokens />
        ) : activeTab === "nfts" ? (
          <TrendingNFTs />
        ) : null}
        <div className="sides">
          <DiscordBotInvite />
          <div className="snapshot-section">
            <h3>NFT Collection Snapshot</h3>
            <input
              type="text"
              placeholder="Enter OW collection slug"
              value={collectionSlug}
              onChange={(e) => setCollectionSlug(e.target.value)}
            />
            <button onClick={fetchSnapshot}>Snap!t</button>
            {snapshotData.length > 0 && (
              <div className="snapshot-results">
                <button onClick={exportToTXT}>Export to TXT</button>
                <button onClick={exportToJSON}>Export to JSON</button>
                <h4>Snapshot Results (Total Holders: {snapshotData.length})</h4>
                <ul>
                  {snapshotData.map(({ address, count }) => (
                    <li key={address}>{address}: {count}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="snapshot-section">
            <h3>DRC-20 Snapshot</h3>
            <input
              type="text"
              placeholder="Enter DRC-20 Ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <button onClick={fetchDrc20Snapshot} disabled={drc20Loading}>
              {drc20Loading ? "Loading..." : "Fetch Snapshot"}
            </button>
            {drc20Holders.length > 0 && (
              <div className="snapshot-results">
                <button onClick={exportDrc20ToTXT}>Export to TXT</button>
                <h4>Snapshot Results (Total Holders: {drc20Holders.length})</h4>
                <ul>
                  {drc20Holders.map(({ address, balance }) => (
                    <li key={address}>{address}: {balance}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* The snapshot and other side content can go here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
