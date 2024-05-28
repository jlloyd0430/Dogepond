import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NFTCard from './NFTCard';

const Dashboard = () => {
  const [nftDrops, setNftDrops] = useState([]);
  const [filter, setFilter] = useState('mostLiked');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/api/nftdrops');
        console.log('Fetched all NFT drops:', result.data); // Log fetched data
        setNftDrops(result.data);
      } catch (error) {
        console.error('Error fetching all NFT drops:', error);
      }
    };
    fetchData();
  }, []);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.post(`http://localhost:5000/api/nftdrops/${id}/like`, {}, config);
      setNftDrops(nftDrops.map(drop => drop._id === id ? { ...drop, likes: drop.likes + 1 } : drop));
    } catch (error) {
      console.error('Error liking drop:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put(`http://localhost:5000/api/nftdrops/approve/${id}`, {}, config);
      setNftDrops(nftDrops.map(drop => drop._id === id ? { ...drop, approved: true } : drop));
    } catch (error) {
      console.error('Error approving drop:', error);
    }
  };

  const sortedDrops = nftDrops.sort((a, b) => {
    if (filter === 'mostLiked') return b.likes - a.likes;
    if (filter === 'mostRecent') return new Date(b.date) - new Date(a.date);
    return 0;
  });

  console.log('Dashboard NFT drops state:', nftDrops); // Log state to ensure it includes all drops

  return (
    <div>
      <h1>Dashboard</h1>
      <select onChange={(e) => setFilter(e.target.value)} value={filter}>
        <option value="mostLiked">Most Liked</option>
        <option value="mostRecent">Most Recent</option>
      </select>
      <div>
        {sortedDrops.length > 0 ? (
          sortedDrops.map((drop) => (
            <NFTCard
              key={drop._id}
              drop={drop}
              onLike={() => handleLike(drop._id)}
              onApprove={() => handleApprove(drop._id)}
            />
          ))
        ) : (
          <p>No NFT drops found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
