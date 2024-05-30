import React from 'react';
import PropTypes from 'prop-types';
import './NFTCard.css';

const NFTCard = ({ drop, onLike, onApprove }) => {
  console.log('Rendering NFTCard with props:', { drop, onLike, onApprove });

  const likesCount = Array.isArray(drop.likes) ? drop.likes.length : 0;

  return (
    <div className="nft-card">
      {drop.image && (
        <img
          src={`https://drc20calendar-32f6b6f7dd9e.herokuapp.com/uploads/${drop.image}`}
          alt={drop.projectName}
          className="nft-card-image"
        />
      )}
      <div className="nft-card-content">
        <h2>{drop.projectName}</h2>
        <p>Price: {drop.price}</p>
        <p>Whitelist Price: {drop.wlPrice}</p>
        <p>Date: {new Date(drop.date).toLocaleDateString()}</p>
        <p>Time: {drop.time}</p>
        <p>Supply: {drop.supply}</p>
        <p>Likes: {likesCount}</p>
        <button
          onClick={() => {
            console.log('Like button clicked for drop ID:', drop._id);
            if (typeof onLike === 'function') {
              onLike(drop._id);
            } else {
              console.error('onLike is not a function');
            }
          }}
        >
          Like
        </button>
        {!drop.approved && (
          <button
            onClick={() => {
              console.log('Approve button clicked for drop ID:', drop._id);
              if (typeof onApprove === 'function') {
                onApprove(drop._id);
              } else {
                console.error('onApprove is not a function');
              }
            }}
          >
            Approve
          </button>
        )}
      </div>
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
    supply: PropTypes.number.isRequired,
    likes: PropTypes.array,
    approved: PropTypes.bool.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
};

export default NFTCard;
