import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NFTCard from './NFTCard';
import apiClient from '../services/apiClient';

const Home = () => {
  const [approvedDrops, setApprovedDrops] = useState([]);
  const [error, setError] = useState(""); // State to store any errors
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
        const result = await apiClient.get('/nftdrops/approved', config);
        console.log('Fetched approved NFT drops:', result.data);
        setApprovedDrops(result.data);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching approved NFT drops:', error);
        setError("Failed to fetch approved NFT drops. Please try again later.");
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

  return (
    <div>
      <h1>Upcoming Drops</h1>
      <div className='card'>
        {error && <p>{error}</p>}
        {approvedDrops.length > 0 ? (
          approvedDrops.map((drop) => (
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
    </div>
  );
};
export default Home;