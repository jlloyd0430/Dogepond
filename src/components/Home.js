import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NFTCard from './NFTCard';
import apiClient from '../services/apiClient';
// import './Home.css';

const Home = () => {
  const [approvedDrops, setApprovedDrops] = useState([]);
  const [error, setError] = useState(""); // State to store any errors
  const [sortOption, setSortOption] = useState("mostRecent"); // Default sort option
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = auth.token
          ? {
              headers: {
                'x-auth-token': auth.token,
              },
            }
          : {};
        const result = await apiClient.get(`/nftdrops/approved?sort=${sortOption}`, config);
        console.log('Fetched approved NFT drops:', result.data);
        setApprovedDrops(result.data);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching approved NFT drops:', error);
        setError("Failed to fetch approved NFT drops. Please try again later.");
      }
    };
    fetchData();
  }, [auth.token, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <h1>Approved NFT Drops</h1>
      <div className="sort-filter">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="mostRecent">Most Recent</option>
          <option value="mostLiked">Most Liked</option>
        </select>
      </div>
      <div>
        {error && <p>{error}</p>}
        {approvedDrops.length > 0 ? (
          approvedDrops.map((drop) => (
            <NFTCard
              key={drop._id}
              drop={drop}
              onLike={null} // Assuming no like functionality on home
              onApprove={null} // Assuming no approve functionality on home
            />
          ))
        ) : (
          <p>No approved NFT drops found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
