import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NFTCard from '../components/NFTCard';
import apiClient from '../services/apiClient';
import AdBannerCarousel from '../components/AdBannerCarousel';
import DiscordBotInvite from '../components/discordBotInvite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import "../App.css";

const Home = () => {
  const [approvedDrops, setApprovedDrops] = useState([]);
  const [filteredDrops, setFilteredDrops] = useState([]);
  const [error, setError] = useState(""); // State to store any errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filter, setFilter] = useState('mostLiked'); // Default to mostLiked
  const [showDropdown, setShowDropdown] = useState(false); // State to show/hide the filter dropdown
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
        const result = await apiClient.get(`/nftdrops/approved?sort=${filter}`, config);
        console.log('Fetched approved NFT drops:', result.data);
        setApprovedDrops(result.data);
        setFilteredDrops(result.data); // Initialize filteredDrops with fetched data
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching approved NFT drops:', error);
        setError("Failed to fetch approved NFT drops. Please try again later.");
      }
    };
    fetchData();
  }, [auth.token, filter]); // Include filter in dependency array

  useEffect(() => {
    const filtered = approvedDrops.filter(drop =>
      drop.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filter === 'mostLiked') {
      filtered.sort((a, b) => b.likes.length - a.likes.length); // Sort by likes
    } else if (filter === 'mostRecent') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date
    }
    setFilteredDrops(filtered);
  }, [searchQuery, approvedDrops, filter]);

  const handleLike = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      console.log('Sending like request for NFT Drop ID:', id);
      const response = await apiClient.post(`/nftdrops/${id}/like`, {}, config);
      console.log('Like response:', response.data);
      setApprovedDrops((prevDrops) =>
        prevDrops.map((drop) => (drop._id === id ? response.data : drop))
      );
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        console.error('Error liking drop:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
    setShowDropdown(false); // Hide the dropdown after selecting a filter
  };

  return (
    <div>
      <AdBannerCarousel /> {/* Add the carousel component here */}
      <h1>Upcoming Drops</h1>
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by project name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="filter-dropdown">
          <FontAwesomeIcon className='search' icon={faFilter} onClick={() => setShowDropdown(!showDropdown)} />
          {showDropdown && (
            <div className="dropdown-menu">
              <div onClick={() => handleFilterChange('mostRecent')}>Most Recent</div>
              <div onClick={() => handleFilterChange('mostLiked')}>Top Voted</div>
            </div>
          )}
        </div>
      </div>
      <div className="main-content">
        <div className="card">
          {error && <p>{error}</p>}
          {filteredDrops.length > 0 ? (
            filteredDrops.map((drop) => (
              <NFTCard
                key={drop._id}
                drop={drop}
                onLike={() => handleLike(drop._id)}
                onApprove={null} // No approve functionality on home
              />
            ))
          ) : (
            <p>No approved NFT drops found.</p>
          )}
        </div>
        <DiscordBotInvite /> {/* Add the Discord bot invite component here */}
      </div>
    </div>
  );
};

export default Home;
