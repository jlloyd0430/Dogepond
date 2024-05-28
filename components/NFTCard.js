import React from 'react';

const NFTCard = ({ drop, onLike, onApprove }) => {
  console.log('NFTCard props:', drop); // Log props received by NFTCard
  return (
    <div>
      <h2>{drop.projectName}</h2>
      <p>Price: {drop.price}</p>
      <p>Whitelist Price: {drop.wlPrice}</p>
      <p>Date: {new Date(drop.date).toLocaleDateString()}</p>
      <p>Time: {drop.time}</p>
      <p>Likes: {drop.likes}</p>
      <button onClick={onLike}>Like</button>
      {!drop.approved && <button onClick={onApprove}>Approve</button>}
    </div>
  );
};

export default NFTCard;
