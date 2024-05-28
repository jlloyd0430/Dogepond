import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NFTCard from './NFTCard';
import apiClient from '../services/apiClient'; // Import the configured axios instance

const Home = () => {
  const [approvedDrops, setApprovedDrops] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': auth.token,
          },
        };
        const result = await apiClient.get('/nftdrops/approved', config);
        console.log('Fetched approved NFT drops:', result.data);
        setApprovedDrops(result.data);
      } catch (error) {
        console.error('Error fetching approved NFT drops:', error);
      }
    };
    fetchData();
  }, [auth.token]);

  return (
    <div>
      <h1>Approved NFT Drops</h1>
      <div>
        {approvedDrops.length > 0 ? (
          approvedDrops.map((drop) => (
            <NFTCard
              key={drop._id}
              drop={drop}
              onLike={null} // No like functionality on home
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
