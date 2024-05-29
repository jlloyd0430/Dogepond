import React from 'react';

const NFTCard = ({ drop, onLike, onApprove }) => {
  console.log('Rendering NFTCard with props:', { drop, onLike, onApprove });

  return (
    <div>
      <h2>{drop.projectName}</h2>
      <p>Price: {drop.price}</p>
      <p>Whitelist Price: {drop.wlPrice}</p>
      <p>Date: {new Date(drop.date).toLocaleDateString()}</p>
      <p>Time: {drop.time}</p>
      <p>Likes: {drop.likes.length}</p> {/* Show number of likes */}
      <button onClick={() => {
        console.log('Like button clicked for drop ID:', drop._id);
        if (typeof onLike === 'function') {
          onLike(drop._id); // Pass the drop ID here
        } else {
          console.error('onLike is not a function');
        }
      }}>Like</button>
      {!drop.approved && <button onClick={() => {
        console.log('Approve button clicked for drop ID:', drop._id);
        if (typeof onApprove === 'function') {
          onApprove(drop._id); // Pass the drop ID here
        } else {
          console.error('onApprove is not a function');
        }
      }}>Approve</button>}
    </div>
  );
};

export default NFTCard;
