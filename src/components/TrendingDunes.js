import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";
import "./Trending.css"; // Add appropriate styles

const TrendingDunes = () => {
  const [dunes, setDunes] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div className="trending-container">
      <h1>Trending Dunes</h1>
      {error && <p className="error">{error}</p>}
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
