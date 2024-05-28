import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import NFTCard from './NFTCard';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [nftDrops, setNftDrops] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': auth.token,
          },
        };
        const result = await axios.get('http://localhost:5000/api/nftdrops', config);
        console.log('Fetched NFT drops:', result.data);
        setNftDrops(result.data);
      } catch (error) {
        console.error('Error fetching all NFT drops:', error);
      }
    };
    fetchData();
  }, [auth.token]);

  const handleLike = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      console.log('Sending like request for NFT Drop ID:', id);
      const response = await axios.post(`http://localhost:5000/api/nftdrops/${id}/like`, {}, config);
      console.log('Like response:', response.data);
      setNftDrops(nftDrops.map(drop => drop._id === id ? response.data : drop));
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        console.error('Error liking drop:', error);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      await axios.put(`http://localhost:5000/api/nftdrops/approve/${id}`, {}, config);
      setNftDrops(nftDrops.map(drop => drop._id === id ? { ...drop, approved: true } : drop));
    } catch (error) {
      console.error('Error approving drop:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {nftDrops && nftDrops.length > 0 ? (
          nftDrops.map((drop) => (
            <NFTCard
              key={drop._id}
              drop={drop}
              onLike={handleLike}
              onApprove={handleApprove}
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
