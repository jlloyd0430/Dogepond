import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Trending.css"; // Add appropriate styles
import DuneForm from "./Duneform"; // Import the form component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'; // Ensure reactstrap is installed
import MyDunes from "./MyDunes"; // Import the MyDunes component
import { submitOrder, checkOrderStatus } from '../services/duneApiClient'; // Import the Dune API functions

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [trendingError, setTrendingError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [view, setView] = useState("dunes");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [duneId, setDuneId] = useState("");
  const [duneSnapshotData, setDuneSnapshotData] = useState([]);
  const [duneLoading, setDuneLoading] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  useEffect(() => {
    const fetchTrendingDunes = async () => {
      try {
        const response = await axios.get("https://ord.dunesprotocol.com/dunes");
        const fetchedDunes = response.data.map(dune => ({
          name: dune.name,
          link: dune.link,
          duneID: dune.duneID,
          mintable: dune.mintable
        }));
        setDunes(fetchedDunes.reverse());
      } catch (error) {
        console.error("Error fetching trending dunes:", error);
        setTrendingError("Failed to fetch trending dunes. Please try again later.");
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
    setDropdownOpen(false); // Close the dropdown after selection
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

  const fetchDuneSnapshot = async () => {
    try {
      setDuneLoading(true);
      const utxoResponse = await axios.get(`https://xdg-mainnet.gomaestro-api.org/v0/assets/dunes/${duneId}/utxos`, {
        headers: {
          "Accept": "application/json",
          "api-key": process.env.REACT_APP_API_KEY,
        },
      });

      const addresses = utxoResponse.data.data.map(utxo => utxo.address);
      const uniqueAddresses = [...new Set(addresses)];

      const duneAmounts = await Promise.all(uniqueAddresses.map(async (address) => {
        const addressResponse = await axios.get(`https://xdg-mainnet.gomaestro-api.org/v0/addresses/${address}/dunes`, {
          headers: {
            "Accept": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        });

        const duneAmount = addressResponse.data.data[duneId] || 0;
        return { address, totalAmount: parseFloat(duneAmount) };
      }));

      setDuneSnapshotData(duneAmounts);
      setDuneLoading(false);
    } catch (error) {
      console.error("Failed to fetch Dune snapshot data:", error.response ? error.response.data : error.message);
      setDuneLoading(false);
    }
  };

  const exportDuneToTXT = () => {
    const txt = duneSnapshotData.map(({ address, totalAmount }) => `${address}: ${totalAmount.toFixed(8)}`).join('\n');
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${duneId}_dune_snapshot.txt`;
    link.click();
  };

  const exportDuneToJSON = () => {
    const json = JSON.stringify(duneSnapshotData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${duneId}_dune_snapshot.json`;
    link.click();
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
          {trendingError && <p className="trending-error">{trendingError}</p>}
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
              <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={dropdownOpen} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                <FontAwesomeIcon icon={faFilter} style={{ color: 'goldenrod' }} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => handleSortOrderChange("mostRecent")}>Most Recent</DropdownItem>
                <DropdownItem onClick={() => handleSortOrderChange("oldest")}>Oldest</DropdownItem>
                <DropdownItem onClick={() => handleSortOrderChange("minting")}>Minting Now</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
        <MyDunes />
      )}

      {/* This is the section where the snapshot tool will be placed */}
      <div className="snapshot-section">
        <h3>Dune Snapshot</h3>
        <input
          type="text"
          placeholder="Enter Dune ID"
          value={duneId}
          onChange={(e) => setDuneId(e.target.value)}
        />
        <button onClick={fetchDuneSnapshot} disabled={duneLoading}>
          {duneLoading ? "Loading..." : "Fetch Snapshot"}
        </button>
        {duneSnapshotData.length > 0 && (
          <div className="snapshot-results">
            <button onClick={exportDuneToTXT}>Export to TXT</button>
            <button onClick={exportDuneToJSON}>Export to JSON</button>
            <h4>Snapshot Results (Total Addresses: {duneSnapshotData.length})</h4>
            <ul>
              {duneSnapshotData.map(({ address, totalAmount }) => (
                <li key={address}>{address}: {totalAmount.toFixed(8)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingDunes;
