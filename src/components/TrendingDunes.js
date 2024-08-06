import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";
import "./Trending.css"; // Add appropriate styles

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletDunes, setWalletDunes] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");

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
            index, // Store the index to use for sorting
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
    setSearchTerm(e.target.value);
  };

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      setError("Please enter a search term.");
      return;
    }

    const encodedSearchTerm = encodeDuneName(searchTerm);
    try {
      const response = await fetchDuneDetails(encodedSearchTerm);
      setDunes([response]);
      setError("");
    } catch (error) {
      setError("Dune not found.");
      console.error(error);
    }
  };

  const encodeDuneName = (duneName) => {
    return duneName.split(' ').join('%E2%80%A2');
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

  const fetchDuneDetails = async (duneName) => {
    const duneUrl = `https://ord.dunesprotocol.com/dune/${duneName}`;
    const response = await axios.get(duneUrl);
    const $ = cheerio.load(response.data);

    const title = $('h1').text().trim();
    const details = {};
    $('dl dt').each((i, el) => {
      const key = $(el).text().trim();
      const value = $(el).next('dd').text().trim();
      details[key] = value;
    });

    return { title, details, duneUrl };
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedDunes = [...dunes].sort((a, b) => {
    if (sortOrder === "mostRecent") {
      return b.index - a.index; // Sort by most recent
    }
    return a.index - b.index; // Sort by oldest
  });

  return (
    <div className="trending-container">
      <h1 className="ttitle">All Dunes</h1>
      {error && <p className="error">{error}</p>}

      <div className="balance-container">
        <input
          type="text"
          placeholder="Enter wallet address..."
          value={walletAddress}
          onChange={handleWalletAddressChange}
        />
        <button onClick={handleFetchBalance}>Check Balance</button>
      </div>

      {balanceError && <p className="error">{balanceError}</p>}
      <div className="wallet-dunes-list">
        {walletDunes.map((dune, index) => (
          <div key={index} className="wallet-dune-card">
            <p>{dune.dune} ({dune.symbol}): {dune.total_balance / (10 ** dune.divisibility)} {dune.symbol}</p>
          </div>
        ))}
      </div>

      <div className="sort-container">
        <label htmlFor="sortOrder">Sort by:</label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
          <option value="mostRecent">Most Recent</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="dune-list">
        {sortedDunes.map((dune, index) => (
          <div key={index} className="dune-card">
            <a href={dune.link} target="_blank" rel="noopener noreferrer">
              <h2>{dune.name}</h2>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingDunes;
