import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";
import "./Trending.css"; // Add appropriate styles
import DuneForm from "./Duneform"; // Import the form component
import { submitOrder, checkOrderStatus } from '../services/duneApiClient'; // Import the Dune API functions
const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletDunes, setWalletDunes] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [view, setView] = useState("dunes"); // State to control which view is active
  useEffect(() => {
    const fetchTrendingDunes = async () => {
      try {
        const response = await axios.get("https://ord.dunesprotocol.com/dunes");
        const htmlData = response.data;
        const $ = cheerio.load(htmlData);
        const duneList = [];
        // Fetch each dune's page to get its ID, timestamp, and mintable status
        const fetchDuneDetails = async (duneName, duneLink) => {
          const duneUrl = `https://ord.dunesprotocol.com${duneLink}`;
          const duneResponse = await axios.get(duneUrl);
          const dunePage = cheerio.load(duneResponse.data);
          const duneID = dunePage('dt:contains("id") + dd').text().trim(); // Extracting the Dune ID
          const timestamp = dunePage('dt:contains("timestamp") + dd').text().trim(); // Extracting the timestamp
          const mintable = dunePage('dt:contains("mintable") + dd').text().trim() === 'true'; // Extracting the mintable status
          
          return { name: duneName, link: duneUrl, index: duneList.length, duneID, timestamp, mintable };
        };
        const dunePromises = $("ul > li > a").map(async (index, element) => {
          const duneName = $(element).text();
          const duneLink = $(element).attr("href");
          return fetchDuneDetails(duneName, duneLink);
        }).get();
        const fetchedDunes = await Promise.all(dunePromises);
        setDunes(fetchedDunes);
      } catch (error) {
        console.error("Error fetching trending dunes:", error);
        setError("Failed to fetch trending dunes. Please try again later.");
      }
    };
    fetchTrendingDunes();
  }, []);
  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };
  const encodeDuneName = (duneName) => {
    return duneName.split(' ').join('•').toUpperCase();
  };
  const handleSearchChange = (e) => {
    // Convert to uppercase and replace spaces with bullet points
    const formattedSearchTerm = e.target.value.toUpperCase().replace(/ /g, '•');
    setSearchTerm(formattedSearchTerm);
  };
  const handleSearch = () => {
    const filteredDunes = dunes.filter(dune =>
      dune.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDunes(filteredDunes);
  };
  const handleFetchBalance = async () => {
    if (!walletAddress) {
      setBalanceError("Please enter a wallet address.");
      return;
    }
    try {
      const response = await axios.get(`https://wonky-ord.dogeord.io/dunes/balance/${walletAddress}?show_all=true`);
      console.log("Fetched Dunes Balance:", response.data); // Log the response
      setWalletDunes(response.data.dunes);
      setBalanceError("");
    } catch (error) {
      console.error(`Error fetching dunes for wallet ${walletAddress}:`, error);
      setBalanceError("Failed to fetch dunes balance. Please try again later.");
    }
  };
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };
  const sortedDunes = [...dunes].sort((a, b) => {
    if (sortOrder === "mostRecent") {
      return new Date(b.timestamp) - new Date(a.timestamp); // Sort by most recent based on timestamp
    }
    return new Date(a.timestamp) - new Date(b.timestamp); // Sort by oldest based on timestamp
  });
  const handleSubmit = async (formData) => {
    try {
      const result = await submitOrder(formData);
      setPaymentInfo({ dogeAmount: result.dogeAmount, address: result.address, index: result.index });
      // Periodically check the order status
      const intervalId = setInterval(async () => {
        try {
          const status = await checkOrderStatus(result.index);
          setOrderStatus(status);
          if (status === 'complete') {
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Error checking order status:', error);
        }
      }, 30000); // Check every 30 seconds
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  return (
    <div className="trending-container">
      <div className="trending-header-container">
        <h1 className="trending-ttitle" onClick={() => setView("dunes")}>All Dunes</h1>
        <h1 className="trending-ttitle" onClick={() => setView("etcher")}>Etcher</h1>
      </div>
      {view === "dunes" && (
        <>
          {error && <p className="trending-error">{error}</p>}
          <div className="trending-balance-container">
            <input
              type="text"
              placeholder="Enter wallet address..."
              value={walletAddress}
              onChange={handleWalletAddressChange}
            />
            <button onClick={handleFetchBalance}>Check Balance</button>
          </div>
          {balanceError && <p className="trending-error">{balanceError}</p>}
          {walletDunes.length > 0 && (
            <div className="trending-wallet-dunes-list">
              {walletDunes.map((dune, index) => (
                <div key={index} className="trending-wallet-dune-card">
                  <p>{dune.dune} ({dune.symbol}): {dune.total_balance / (10 ** dune.divisibility)} {dune.symbol}</p>
                </div>
              ))}
            </div>
          )}
          {walletDunes.length === 0 && !balanceError && (
            <p>No dunes found for this wallet.</p>
          )}
          <div className="trending-sort-container">
            <label htmlFor="sortOrder">Sort by:</label>
            <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
              <option value="mostRecent">Most Recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div className="trending-search-container">
            <input
              type="text"
              placeholder="Search Dunes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="trending-search-input"
            />
            <button className="trending-search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className="trending-dune-list">
            {sortedDunes.map((dune, index) => (
              <div key={index} className="trending-dune-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <a href={dune.link} target="_blank" rel="noopener noreferrer">
                     <h2>{dune.name}</h2>
                   </a>
                   <div className="wonkyi" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                     {/* Mintable Status */}
                     {dune.mintable && <span style={{ color: "green", fontWeight: "bold" }}>Minting</span>}
                     {/* Copy ID Button */}
   <button onClick={() => navigator.clipboard.writeText(dune.duneID)}>Copy ID</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {view === "etcher" && (
        <div className="trending-form-container">
          <DuneForm onSubmit={handleSubmit} />
          {paymentInfo && (
            <div className="trending-payment-popup">
              <p>Please send {paymentInfo.dogeAmount} DOGE to the following address:</p>
              <p>{paymentInfo.address}</p>
              <button onClick={() => navigator.clipboard.writeText(paymentInfo.address)}>Copy Address</button>
              {orderStatus && <p>Order Status: {orderStatus}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default TrendingDunes;
