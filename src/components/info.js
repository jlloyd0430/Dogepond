import React, { useState } from "react";
import TrendingDunes from "./TrendingDunes";
import TrendingTokens from "./TrendingTokens";
import TrendingNFTs from "./TrendingNFTs";
import "./Trending.css"; // Add appropriate styles

const Info = () => {
  const [activePage, setActivePage] = useState("dunes");

  return (
    <div className="main-container">
      <div className="button-container">
        <button onClick={() => setActivePage("dunes")}>Dunes</button>
        <button onClick={() => setActivePage("drc20")}>DRC-20</button>
        <button onClick={() => setActivePage("nfts")}>NFTs</button>
      </div>
      <div className="content-container">
        {activePage === "dunes" && <TrendingDunes />}
        {activePage === "drc20" && <TrendingTokens />}
        {activePage === "nfts" && <TrendingNFTs />}
      </div>
    </div>
  );
};

export default Info;
