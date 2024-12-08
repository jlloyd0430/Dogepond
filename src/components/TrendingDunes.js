import React, { useState, useEffect } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import "./Trending.css";
import DuneForm from "./Duneform";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import MyDunes from "./MyDunes";
import { submitOrder, checkOrderStatus } from '../services/duneApiClient';
import ErrorBoundary from './ErrorBoundary';

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [view, setView] = useState("dunes");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDune, setSelectedDune] = useState(null);
  const [duneDetails, setDuneDetails] = useState(null);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  useEffect(() => {
    // Fetch only dune names and links on initial load
    const fetchTrendingDunes = async () => {
      try {
        const response = await axios.get("https://wonky-ord-v2.dogeord.io/dunes");
        const htmlData = response.data;
        const $ = cheerio.load(htmlData);

        const duneList = $("ul > li > a").map((index, element) => {
          const duneName = $(element).text();
          const duneLink = $(element).attr("href");
          return { name: duneName, link: duneLink };
        }).get();

        setDunes(duneList.reverse());
      } catch (error) {
        console.error("Error fetching trending dunes:", error);
        setError("Failed to fetch trending dunes. Please try again later.");
      }
    };

    fetchTrendingDunes();
  }, []);

  const formatDuneNameForUrl = (name) => {
    return name.toUpperCase().replace(/\s+/g, '%E2%80%A2');
  };

 const fetchDuneDetails = async (dune) => {
  try {
    const formattedName = formatDuneNameForUrl(dune.name);
    const response = await axios.get(`https://wonky-ord-v2.dogeord.io/dune/${formattedName}`);
    const htmlData = response.data;
    const $ = cheerio.load(htmlData);

    const details = {
      id: $('dt:contains("id") + dd').text().trim() || "N/A",
      etchingBlock: $('dt:contains("etching block") + dd').text().trim() || "N/A",
      etchingTx: $('dt:contains("etching transaction") + dd').text().trim() || "N/A",
      mintStart: $('dt:contains("start") + dd').text().trim() || "none",
      mintEnd: $('dt:contains("end") + dd').text().trim() || "none",
      mintAmount: $('dt:contains("amount") + dd').text().trim() || "0",
      mints: $('dt:contains("mints") + dd').text().trim() || "N/A",
      cap: $('dt:contains("cap") + dd').text().trim() || "none",
      remaining: $('dt:contains("remaining") + dd').text().trim() || "unlimited",
      mintable: $('dt:contains("mintable") + dd').text().trim() === "true",
      supply: $('dt:contains("supply") + dd').text().trim() || "N/A",
      premine: $('dt:contains("premine") + dd').text().trim() || "N/A",
      preminePercentage: $('dt:contains("premine percentage") + dd').text().trim() || "N/A",
      burned: $('dt:contains("burned") + dd').text().trim() || "N/A",
      divisibility: $('dt:contains("divisibility") + dd').text().trim() || "N/A",
      symbol: $('dt:contains("symbol") + dd').text().trim() || "N/A",
      turbo: $('dt:contains("turbo") + dd').text().trim() === "true",
      etching: $('dt:contains("etching") + dd').text().trim() || "N/A",
    };

    setDuneDetails(details);
  } catch (error) {
    console.error("Error fetching dune details:", error);
    setError("Failed to fetch dune details. Please try again later.");
  }
};


  const handleDuneClick = (dune) => {
    if (selectedDune && selectedDune.name === dune.name) {
      setSelectedDune(null);
      setDuneDetails(null);
    } else {
      setSelectedDune(dune);
      fetchDuneDetails(dune);
    }
  };

  const handleSearchChange = (e) => {
    const formattedSearchTerm = e.target.value.toUpperCase().replace(/ /g, '•');
    setSearchTerm(formattedSearchTerm);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    let sortedDunes = [...dunes];

    if (order === "mostRecent") {
      sortedDunes.reverse();
    } else if (order === "minting") {
      sortedDunes = sortedDunes.filter(dune => duneDetails && duneDetails.mintable);
    } else if (order === "mostMinted") {
      sortedDunes.sort((a, b) => (duneDetails?.[b.name]?.mints || 0) - (duneDetails?.[a.name]?.mints || 0));
    }

    setDunes(sortedDunes);
    setDropdownOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      const result = await submitOrder(formData);
      setPaymentInfo({ dogeAmount: result.dogeAmount, address: result.address, index: result.index });

      const intervalId = setInterval(async () => {
        try {
          const status = await checkOrderStatus(result.index);
          setOrderStatus(status.status);
          if (status.status === 'complete') {
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

  const filteredDunes = dunes.filter(dune => dune.name.includes(searchTerm));

  return (
    <ErrorBoundary>
      <div className="trending-container">
        <div className="trending-header-container">
          <h1 className="trending-ttitle" onClick={() => setView("dunes")}>All Dunes</h1>
          <h1 className="trending-ttitle" onClick={() => setView("etcher")}>Etch Dunes</h1>
          <h1 className="trending-ttitle" onClick={() => setView("myDunes")}>My Dunes</h1>
        </div>
        {view === "dunes" && (
          <>
            {error && <p className="trending-error">{error}</p>}
            <div className="trending-controls-container" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search by dune name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="trending-search-input"
                style={{ flex: 1 }}
              />
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="trending-filter-dropdown">
                <DropdownToggle tag="span" aria-expanded={dropdownOpen} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                  <FontAwesomeIcon icon={faFilter} style={{ color: 'goldenrod' }} />
                </DropdownToggle>
                {dropdownOpen && (
                  <DropdownMenu right>
                    <DropdownItem onClick={() => handleSortOrderChange("mostRecent")}>Most Recent</DropdownItem>
                    <DropdownItem onClick={() => handleSortOrderChange("minting")}>Minting Now</DropdownItem>
                    <DropdownItem onClick={() => handleSortOrderChange("mostMinted")}>Most Minted</DropdownItem>
                  </DropdownMenu>
                )}
              </Dropdown>
            </div>
            <div className="trending-dune-list">
              {filteredDunes.map((dune, index) => (
                <div key={index} className="trending-dune-card" onClick={() => handleDuneClick(dune)}>
                  <h2>{dune.name}</h2>
                  {selectedDune && selectedDune.name === dune.name && duneDetails && (
                    <div className="dune-details">
                      <p>Dune ID: {duneDetails.id}</p>
                      <p>Etching Block: {duneDetails.etchingBlock}</p>
                      <p>Etching TX: {duneDetails.etchingTx}</p>
                      <p>Mint Start: {duneDetails.mintStart}</p>
                      <p>Mint End: {duneDetails.mintEnd}</p>
                      <p>Mint Amount: {duneDetails.mintAmount}</p>
                      <p>Mints: {duneDetails.mints}</p>
                      <p>Cap: {duneDetails.cap}</p>
                      <p>Remaining: {duneDetails.remaining}</p>
                      <p>Mintable: {duneDetails.mintable ? "Yes" : "No"}</p>
                      <p>Supply: {duneDetails.supply}</p>
                      <p>Premine: {duneDetails.premine}</p>
                      <p>Premine Percentage: {duneDetails.preminePercentage}</p>
                      <p>Burned: {duneDetails.burned}</p>
                      <p>Divisibility: {duneDetails.divisibility}</p>
                      <p>Symbol: {duneDetails.symbol}</p>
                      <p>Turbo: {duneDetails.turbo ? "Yes" : "No"}</p>
                      <p>Etching: {duneDetails.etching}</p>
                      <button onClick={() => navigator.clipboard.writeText(duneDetails.id)}>Copy ID</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {view === "etcher" && <DuneForm onSubmit={handleSubmit} />}
        {view === "myDunes" && <MyDunes />}
      </div>
    </ErrorBoundary>
  );
};

export default TrendingDunes;
