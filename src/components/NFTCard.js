import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './NFTCard.css';

const NFTCard = ({ drop, onLike, onApprove }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('Rendering NFTCard with props:', { drop, onLike, onApprove });

  const likesCount = Array.isArray(drop.likes) ? drop.likes.length : 0;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
        <button onClick={toggleExpand}>
          {isExpanded ? 'View Less' : 'View More'}
        </button>
        <div className={`nft-card-details ${isExpanded ? 'expanded' : ''}`}>
          {drop.description && <p>Description: {drop.description}</p>}
          {drop.website && (
            <p>
              Website:{' '}
              <a href={drop.website} target="_blank" rel="noopener noreferrer">
                {drop.website}
              </a>
            </p>
          )}
          {drop.xCom && (
            <p>
              X.com:{' '}
              <a href={drop.xCom} target="_blank" rel="noopener noreferrer">
                {drop.xCom}
              </a>
            </p>
          )}
          {drop.telegram && (
            <p>
              Telegram:{' '}
              <a href={drop.telegram} target="_blank" rel="noopener noreferrer">
                {drop.telegram}
              </a>
            </p>
          )}
          {drop.discord && (
            <p>
              Discord:{' '}
              <a href={drop.discord} target="_blank" rel="noopener noreferrer">
                {drop.discord}
              </a>
            </p>
          )}
        </div>
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
    description: PropTypes.string,
    website: PropTypes.string,
    xCom: PropTypes.string,
    telegram: PropTypes.string,
    discord: PropTypes.string,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
};

export default NFTCard;
