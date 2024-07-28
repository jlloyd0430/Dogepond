import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import apiClient from "../services/apiClient";
import AdBannerCarousel from "../components/AdBannerCarousel";
import DiscordBotInvite from "../components/discordBotInvite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const Home = () => {
  const [approvedDrops, setApprovedDrops] = useState([]);
  const [filteredDrops, setFilteredDrops] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("mostLiked");
  const [dropType, setDropType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropTypeDropdown, setShowDropTypeDropdown] = useState(false);
  const { auth } = useContext(AuthContext);

  const [collectionSlug, setCollectionSlug] = useState("");
  const [snapshotData, setSnapshotData] = useState([]);
  // const [drc20Ticker, setDrc20Ticker] = useState("");
  // const [drc20SnapshotData, setDrc20SnapshotData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    applyFilter();
  }, [searchQuery, approvedDrops, filter, dropType]);

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
    setShowDropdown(false);
  };

  const handleDropTypeChange = (type) => {
    setDropType(type);
    setShowDropTypeDropdown(false);
  };

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

  // const exportDrc20ToTXT = () => {
  //   const txt = drc20SnapshotData.map(({ address, balance }) => `${address}: ${balance}`).join('\n');
  //   const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `${drc20Ticker}_drc20_snapshot.txt`;
  //   link.click();
  // };

  const exportToJSON = () => {
    const json = JSON.stringify(snapshotData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${collectionSlug}_snapshot.json`;
    link.click();
  };

  // const exportDrc20ToJSON = () => {
  //   const json = JSON.stringify(drc20SnapshotData, null, 2);
  //   const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `${drc20Ticker}_drc20_snapshot.json`;
  //   link.click();
  // };

  return (
    <div>
      <div className="ads">
        <AdBannerCarousel />
        <h1>Upcoming Drops</h1>
      </div>
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
      <div className="main-content">
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
          {/* <div className="snapshot-section">
            <h3>DRC-20 Snapshot</h3>
            <input
              type="text"
              placeholder="Enter DRC-20 ticker CAPS"
              value={drc20Ticker}
              onChange={(e) => setDrc20Ticker(e.target.value)}
            />
            <button onClick={fetchDrc20Snapshot} disabled={loading}>
              {loading ? 'Loading...' : 'Snap!t'}
            </button>
            {drc20SnapshotData.length > 0 && (
              <div className="snapshot-results">
                <button onClick={exportDrc20ToTXT}>Export to TXT</button>
                <button onClick={exportDrc20ToJSON}>Export to JSON</button>
                <h4>Snapshot Results (Total Holders: {drc20SnapshotData.length})</h4>
                <ul>
                  {drc20SnapshotData.map(({ address, balance }) => (
                    <li key={address}>{address}: {balance}</li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
