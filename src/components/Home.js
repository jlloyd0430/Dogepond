import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import apiClient from "../services/apiClient";
import AdBannerCarousel from "../components/AdBannerCarousel";
import DiscordBotInvite from "../components/discordBotInvite"; // Corrected component name case
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Papa from 'papaparse';

    
 const Home = () => {
  
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
  const [drc20Ticker, setDrc20Ticker] = useState("");
  const [drc20SnapshotData, setDrc20SnapshotData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

    
const Home = () => {
  
      try {
        const config = auth.token
          ? {
              headers: {
                "x-auth-token": auth.token,
              },
            }
          : {};
        const result = await apiClient.get("/nftdrops/approved", config);
        console.log("Fetched approved NFT drops:", result.data);
        setApprovedDrops(result.data);
        setError("");
      } catch (error) {
        console.error("Error fetching approved NFT drops:", error);
        setError("Failed to fetch approved NFT drops. Please try again later.");
      }
    };

    
          
const Home = () => {
  
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

    console.log("Filtered drops:", filtered);
    setFilteredDrops(filtered);
  };


 const Home = () => {
  
  const handleLike = async (id) => {
    try {
      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };
      console.log("Sending like request for NFT Drop ID:", id);
      const response = await apiClient.post(`/nftdrops/${id}/like`, {}, config);
      console.log("Like response:", response.data);
      setApprovedDrops((prevDrops) =>
        prevDrops.map((drop) => (drop._id === id ? response.data : drop))
      );
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        console.error("Error liking drop:", error);
      }
    }
  };

const Home = () => {
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterValue) => {
    console.log(`Changing filter to: ${filterValue}`);
    setFilter(filterValue);
    setShowDropdown(false);
  };

  const handleDropTypeChange = (type) => {
    console.log(`Changing drop type to: ${type}`);
    setDropType(type);
    setShowDropTypeDropdown(false);
  };

const Home = () => {
  
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

  const fetchDrc20Snapshot = async () => {
    let allData = [];
    let page = 0;
    const limit = 100; // Adjust as per API limits

    try {
      while (true) {
        const response = await fetch(`https://xdg-mainnet.gomaestro-api.org/v0/assets/drc20/${drc20Ticker}/holders?limit=${limit}&page=${page}`, {
          headers: {
            'Accept': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        });
        const data = await response.json();

        if (data.data.length === 0) break; // No more data

        allData = allData.concat(data.data.map(item => ({
          address: item.address,
          balance: item.balance
        })));

        page++;
      }

      setDrc20SnapshotData(allData);
    } catch (error) {
      console.error('Failed to fetch DRC-20 snapshot data:', error);
    }
  };

  const exportToCSV = () => {
const Home = () => {
  
    const csv = Papa.unparse(snapshotData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${collectionSlug}_snapshot.csv`;
    link.click();
  };
  const exportDrc20ToCSV = () => {
    const csv = Papa.unparse(drc20SnapshotData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${drc20Ticker}_drc20_snapshot.csv`;
    link.click();
  };
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
          <div className="snapshot-section">
            <h3>DRC-20 Snapshot</h3>
            <input
              type="text"
              placeholder="Enter DRC-20 ticker CAPS"
              value={drc20Ticker}
              onChange={(e) => setDrc20Ticker(e.target.value)}
            />
            <button onClick={fetchDrc20Snapshot}>Snap!t</button>
            {drc20SnapshotData.length > 0 && (
              <div className="snapshot-results">
                <h4>Snapshot Results</h4>

                <ul>
                  {drc20SnapshotData.map(({ address, balance }) => (
                    <li key={address}>{address}: {balance}</li>
                  ))}
                </ul>
                <button onClick={exportDrc20ToCSV}>Export to CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
