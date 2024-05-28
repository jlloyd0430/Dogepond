import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NFTCard from './NFTCard';

const Home = () => {
  const [nftDrops, setNftDrops] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5000/api/nftdrops/approved');
        console.log('Fetched approved NFT drops:', result.data);
        setNftDrops(result.data);
      } catch (error) {
        console.error('Error fetching approved NFT drops:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        {nftDrops.length > 0 ? (
          nftDrops.map((drop) => (
            <NFTCard key={drop._id} drop={drop} />
          ))
        ) : (
          <p>No approved NFT drops found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
