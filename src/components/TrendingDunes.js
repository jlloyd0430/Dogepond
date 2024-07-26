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

  const handleSearch = () => {
    if (!searchTerm) {
      setError("Please enter a search term.");
      return;
    }

    const encodedSearchTerm = encodeDuneName(searchTerm);
    const filteredDunes = dunes.filter(dune => dune.name.toLowerCase().includes(encodedSearchTerm.toLowerCase()));
    setDunes(filteredDunes);
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

  return (
    <div className="trending-container">
      <h1>All Dunes</h1>
      {error && <p className="error">{error}</p>}
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a dune..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

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

      <div className="dune-list">
        {dunes.map((dune, index) => (
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
