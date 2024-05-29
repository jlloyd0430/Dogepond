import React from 'react';
import PropTypes from 'prop-types';

const NFTCard = ({ drop, onLike, onApprove }) => {
  console.log('Rendering NFTCard with props:', { drop, onLike, onApprove });

  const likesCount = Array.isArray(drop.likes) ? drop.likes.length : 0;

  return (
    <div>
      <h2>{drop.projectName}</h2>
      <p>Price: {drop.price}</p>
      <p>Whitelist Price: {drop.wlPrice}</p>
      <p>Date: {new Date(drop.date).toLocaleDateString()}</p>
      <p>Time: {drop.time}</p>
      <p>Supply: {drop.supply}</p> {/* Display the supply */}
      <p>Likes: {likesCount}</p>
      <button onClick={() => {
        console.log('Like button clicked for drop ID:', drop._id);
        if (typeof onLike === 'function') {
          onLike(drop._id);
        } else {
          console.error('onLike is not a function');
        }
      }}>Like</button>
      {!drop.approved && (
        <button onClick={() => {
          console.log('Approve button clicked for drop ID:', drop._id);
          if (typeof onApprove === 'function') {
            onApprove(drop._id);
          } else {
            console.error('onApprove is not a function');
          }
        }}>Approve</button>
      )}
    </div>
  );
};

NFTCard.propTypes = {
  drop: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    wlPrice: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    supply: PropTypes.number.isRequired, // Include supply in PropTypes
    likes: PropTypes.array,
    approved: PropTypes.bool.isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
};

export default NFTCard;
