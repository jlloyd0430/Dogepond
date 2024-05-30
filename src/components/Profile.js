import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NFTCard from './NFTCard'; // Assuming you have an NFTCard component to display each NFT drop
import axios from 'axios';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [nftDrops, setNftDrops] = useState([]);

  useEffect(() => {
    const fetchUserNFTDrops = async () => {
      if (auth.token) {
        try {
          const response = await axios.get('https://drc20calendar-32f6b6f7dd9e.herokuapp.com/api/nftdrops/user', {
            headers: { 'x-auth-token': auth.token }
          });
          setNftDrops(response.data);
        } catch (error) {
          console.error('Error fetching user NFT drops:', error);
        }
      }
    };

    fetchUserNFTDrops();
  }, [auth.token]);

  return (
    <div>
      <h1>Your NFT Drops</h1>
      {nftDrops.length > 0 ? (
        nftDrops.map(drop => (
          <NFTCard key={drop._id} drop={drop} />
        ))
      ) : (
        <p>You have no NFT drops.</p>
      )}
    </div>
  );
};

export default Profile;
