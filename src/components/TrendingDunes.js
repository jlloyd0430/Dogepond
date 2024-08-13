import React, { useState, useEffect } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import "./Trending.css"; // Add appropriate styles
import DuneForm from "./Duneform"; // Import the form component
import MyDunes from "./MyDunes"; // Import the MyDunes component
import { submitOrder, checkOrderStatus } from '../services/duneApiClient'; // Import the Dune API functions

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
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
          const duneUrl = `https://ord.dunesprotocol.com${duneLink}`;

          duneList.push({ name: duneName, link: duneUrl });
        });

        // Reverse the order of dunes to show the last dune first
        const reversedDunes = duneList.reverse();
        setDunes(reversedDunes);
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

  const filteredDunes = dunes.filter(dune =>
    dune.name.includes(searchTerm)
  );

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
        <h1 className="trending-ttitle" onClick={() => setView("myDunes")}>My Dunes</h1> {/* New tab */}
      </div>

      {view === "dunes" && (
        <>
          {error && <p className="trending-error">{error}</p>}
          <div className="trending-search-container">
            <input
              type="text"
              placeholder="Search Dunes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="trending-search-input"
            />
          </div>
          <div className="trending-dune-list">
            {filteredDunes.map((dune, index) => (
              <div key={index} className="trending-dune-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href={dune.link} target="_blank" rel="noopener noreferrer">
                    <h2>{dune.name}</h2>
                  </a>
                  <div className="wonkyi" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={() => navigator.clipboard.writeText(dune.name)}>Copy Name</button>
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
        <MyDunes /> // Render the My Dunes component
      )}
    </div>
  );
};

export default TrendingDunes;
