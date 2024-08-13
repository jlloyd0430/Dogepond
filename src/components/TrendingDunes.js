import React, { useState, useEffect } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import "./Trending.css"; // Add appropriate styles
import DuneForm from "./Duneform"; // Import the form component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'; // Ensure reactstrap is installed
import { submitOrder, checkOrderStatus } from '../services/duneApiClient'; // Import the Dune API functions

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [view, setView] = useState("dunes");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletDunes, setWalletDunes] = useState([]);
  const [balanceError, setBalanceError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  useEffect(() => {
    const fetchTrendingDunes = async () => {
      try {
        const response = await axios.get("https://ord.dunesprotocol.com/dunes");
        const htmlData = response.data;
        const $ = cheerio.load(htmlData);
        const duneList = [];

        const fetchDuneDetails = async (duneName, duneLink) => {
          const duneUrl = `https://ord.dunesprotocol.com${duneLink}`;
          const duneResponse = await axios.get(duneUrl);
          const dunePage = cheerio.load(duneResponse.data);
          const duneID = dunePage('dt:contains("id") + dd').text().trim();
          const mintable = dunePage('dt:contains("mintable") + dd').text().trim() === 'true';

          return { name: duneName, link: duneUrl, duneID, mintable };
        };

        const dunePromises = $("ul > li > a").map(async (index, element) => {
          const duneName = $(element).text();
          const duneLink = $(element).attr("href");
          return fetchDuneDetails(duneName, duneLink);
        }).get();

        const fetchedDunes = await Promise.all(dunePromises);

        // By default, display the dunes in reverse order to show the most recent first
        setDunes(fetchedDunes.reverse());
      } catch (error) {
        console.error("Error fetching trending dunes:", error);
        setError("Failed to fetch trending dunes. Please try again later.");
      }
    };

    fetchTrendingDunes();
  }, []);

  const handleSearchChange = (e) => {
    const formattedSearchTerm = e.target.value.toUpperCase().replace(/ /g, '•');
    setSearchTerm(formattedSearchTerm);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    if (order === "mostRecent") {
      setDunes([...dunes].reverse());
    } else if (order === "oldest") {
      setDunes([...dunes].reverse());
    } else if (order === "minting") {
      const mintingDunes = dunes.filter(dune => dune.mintable);
      setDunes(mintingDunes);
    }
  };

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

  const filteredDunes = dunes.filter(dune => {
    if (sortOrder === "minting") {
      return dune.mintable && dune.name.includes(searchTerm);
    }
    return dune.name.includes(searchTerm);
  });

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
        <h1 className="trending-ttitle" onClick={() => setView("etcher")}>Etch Dunes</h1>
        <h1 className="trending-ttitle" onClick={() => setView("myDunes")}>My Dunes</h1>
      </div>

      {view === "dunes" && (
        <>
          {error && <p className="trending-error">{error}</p>}
          <div className="trending-controls-container">
            <div className="trending-search-filter">
              <input
                type="text"
                placeholder="Search by project name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="trending-search-input"
              />
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret>
                  <FontAwesomeIcon icon={faFilter} />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleSortOrderChange("mostRecent")}>Most Recent</DropdownItem>
                  <DropdownItem onClick={() => handleSortOrderChange("oldest")}>Oldest</DropdownItem>
                  <DropdownItem onClick={() => handleSortOrderChange("minting")}>Minting Now</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="wallet-checker">
              <input
                type="text"
                placeholder="Enter wallet address..."
                value={walletAddress}
                onChange={handleWalletAddressChange}
                className="wallet-check-input"
              />
              <button onClick={handleFetchBalance}>Check Balance</button>
            </div>
          </div>
          <div className="trending-dune-list">
            {filteredDunes.map((dune, index) => (
              <div key={index} className="trending-dune-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href={dune.link} target="_blank" rel="noopener noreferrer">
                    <h2>{dune.name}</h2>
                  </a>
                  <div className="wonkyi" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {dune.mintable && <span style={{ color: "green", fontWeight: "bold" }}>Minting</span>}
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

      {view === "myDunes" && (
        <>
          <div className="my-dunes-container">
            <h1>My Dunes</h1>
            <div className="my-dunes-balance-container">
              <input
                type="text"
                placeholder="Enter wallet address..."
                value={walletAddress}
                onChange={handleWalletAddressChange}
              />
              <button onClick={handleFetchBalance}>Check Balance</button>
            </div>
            {balanceError && <p className="my-dunes-error">{balanceError}</p>}
            {walletDunes.length > 0 && (
              <div className="my-dunes-list">
                {walletDunes.map((dune, index) => (
                  <div key={index} className="my-dune-card">
                    <p>{dune.dune} ({dune.symbol}): {dune.total_balance / (10 ** dune.divisibility)} {dune.symbol}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrendingDunes;
