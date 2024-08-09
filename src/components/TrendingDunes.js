import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";
import "./Trending.css";
import DuneForm from "./Duneform";
import { submitOrder, checkOrderStatus } from '../services/duneApiClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons"; // Import the FontAwesome icons

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletDunes, setWalletDunes] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const [view, setView] = useState("dunes");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const fetchTrendingDunes = async () => {
      try {
        const response = await axios.get("https://ord.dunesprotocol.com/dunes");
        const htmlData = response.data;

        const $ = cheerio.load(htmlData);
        const duneList = [];

        $("ul > li > a").each((index, element) => {
          const duneName = $(element).text();
          const duneLink = $(element).attr("href");

          duneList.push({
            name: duneName,
            link: `https://ord.dunesprotocol.com${duneLink}`,
            index,
          });
        });

        setDunes(duneList);
      } catch (error) {
        console.error("Error fetching trending dunes:", error);
        setError("Failed to fetch trending dunes. Please try again later.");
      }
    };
    fetchTrendingDunes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDunes = dunes.filter((dune) =>
    dune.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setShowSortDropdown(false);
  };

  const sortedDunes = [...filteredDunes].sort((a, b) => {
    if (sortOrder === "mostRecent") {
      return b.index - a.index;
    }
    return a.index - b.index;
  });

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleFetchBalance = async () => {
    if (!walletAddress) {
      setBalanceError("Please enter a wallet address.");
      return;
    }

    try {
      const response = await axios.get(`https://wonky-ord.dogeord.io/dunes/balance/${walletAddress}?show_all=true`);
      setWalletDunes(response.data.dunes);
      setBalanceError("");
    } catch (error) {
      console.error(`Error fetching dunes for wallet ${walletAddress}:`, error);
      setBalanceError("Failed to fetch dunes balance. Please try again later.");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const result = await submitOrder(formData);
      setPaymentInfo({ dogeAmount: result.dogeAmount, address: result.address, index: result.index });

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
      }, 30000);
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
          <div className="trending-wallet-dunes-list">
            {walletDunes.map((dune, index) => (
              <div key={index} className="trending-wallet-dune-card">
                <p>{dune.dune} ({dune.symbol}): {dune.total_balance / (10 ** dune.divisibility)} {dune.symbol}</p>
              </div>
            ))}
          </div>

          <div className="trending-sort-search-container">
            <div className="trending-sort-container">
              <FontAwesomeIcon
                icon={faSort}
                className="trending-sort-icon"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              />
              {showSortDropdown && (
                <div className="trending-sort-dropdown">
                  <div onClick={() => handleSortOrderChange("mostRecent")}>
                    Most Recent
                  </div>
                  <div onClick={() => handleSortOrderChange("oldest")}>
                    Oldest
                  </div>
                </div>
              )}
            </div>

            <div className="trending-search-container">
              <input
                type="text"
                placeholder="Search Dunes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="trending-search-input"
              />
              <button className="trending-search-button">Search</button>
            </div>
          </div>

          <div className="trending-dune-list">
            {sortedDunes.map((dune, index) => (
              <div key={index} className="trending-dune-card">
                <a href={dune.link} target="_blank" rel="noopener noreferrer">
                  <h2>{dune.name}</h2>
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "etcher" && (
        <div className="trending-form-container">
          <DuneForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export default TrendingDunes;
