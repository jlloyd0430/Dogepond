import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import apiClient from "../services/apiClient";
import AdBannerCarousel from "../components/AdBannerCarousel";
import DiscordBotInvite from "../components/discordBotInvite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Papa from 'papaparse'; // Import Papa parse
import "../App.css";

const Home = () => {
  const [approvedDrops, setApprovedDrops] = useState([]);
  const [filteredDrops, setFilteredDrops] = useState([]);
  const [error, setError] = useState(""); // State to store any errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filter, setFilter] = useState("mostLiked"); // Default to mostLiked
  const [dropType, setDropType] = useState(""); // State for drop type filter
  const [showDropdown, setShowDropdown] = useState(false); // State to show/hide the filter dropdown
  const [showDropTypeDropdown, setShowDropTypeDropdown] = useState(false); // State to show/hide the drop type dropdown
  const { auth } = useContext(AuthContext);

  const [collectionSlug, setCollectionSlug] = useState(""); // State for collection slug
  const [snapshotData, setSnapshotData] = useState([]); // State for snapshot data

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
        console.log("Fetched approved NFT drops:", result.data);
        setApprovedDrops(result.data);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching approved NFT drops:", error);
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
      filtered.sort((a, b) => b.likes.length - a.likes.length); // Sort by likes
    } else if (filter === "mostRecent") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date
    }

    console.log("Filtered drops:", filtered); // Debug log for filtered drops
    setFilteredDrops(filtered);
  };

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterValue) => {
    console.log(`Changing filter to: ${filterValue}`); // Debug log for filter change
    setFilter(filterValue);
    setShowDropdown(false); // Hide the dropdown after selecting a filter
  };

  const handleDropTypeChange = (type) => {
    console.log(`Changing drop type to: ${type}`); // Debug log for drop type change
    setDropType(type);
    setShowDropTypeDropdown(false); // Hide the dropdown after selecting a drop type
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
    <div>
      <AdBannerCarousel /> {/* Add the carousel component here */}
      <h1>Upcoming Drops</h1>
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
                onApprove={null} // No approve functionality on home
                userId={auth.user?.id} // Add userId for edit button visibility
                isProfilePage={false} // Add isProfilePage for conditional rendering
              />
            ))
          ) : (
            <p>No approved NFT drops found.</p>
          )}
        </div>
        <DiscordBotInvite /> {/* Add the Discord bot invite component here */}
        <div className="snapshot-section">
          <h2>General Tools</h2>
          <h3>Snapshot Tool</h3>
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
      </div>
    </div>
  );
};

export default Home;
