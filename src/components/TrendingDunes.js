import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";
import "./Trending.css";
import DuneForm from "./Duneform";
import { submitOrder, checkOrderStatus } from '../services/duneApiClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons"; // Import the FontAwesome filter icon

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletDunes, setWalletDunes] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const [view, setView] = useState("dunes");

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

  const filteredDunes = dunes.filter(dune =>
    dune.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedDunes = [...filteredDunes].sort((a, b) => {
    if (sortOrder === "mostRecent") {
      return b.index - a.index;
    }
    return a.index - b.index;
  });

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
              onChange={(e) => setWalletAddress(e.target.value)}
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
                value={searchQuery}
                onChange={handleSearchChange}
                className="trending-search-input"
              />
              <FontAwesomeIcon icon={faFilter} className="trending-search-icon" />
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
