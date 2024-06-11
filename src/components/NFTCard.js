import React, { useState } from "react";
import PropTypes from "prop-types";
import "./NFTCard.css";

const NFTCard = ({ drop, onLike, onApprove, isProfilePage, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const likesCount = Array.isArray(drop.likes) ? drop.likes.length : 0;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderPriceInfo = () => {
    if (drop.dropType === "new mint") {
      return (
        <>
          <p>Price: {drop.price !== undefined ? drop.price : "N/A"}</p>
          <p>
            Whitelist Price: {drop.wlPrice !== undefined ? drop.wlPrice : "N/A"}
          </p>
        </>
      );
    } else if (drop.dropType === "auction") {
      return (
        <>
          <p>
            Starting Price:{" "}
            {drop.startingPrice !== undefined ? drop.startingPrice : "N/A"}
          </p>
          <p>
            Marketplace Link:{" "}
            <a
              href={drop.marketplaceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {drop.marketplaceLink || "N/A"}
            </a>
          </p>
        </>
      );
    } else if (drop.dropType === "airdrop") {
      return (
        <p>
          Project Link:{" "}
          <a href={drop.projectLink} target="_blank" rel="noopener noreferrer">
            {drop.projectLink || "N/A"}
          </a>
        </p>
      );
    }
    return null;
  };

  return (
    <div className="nft-card">
      {drop.image && (
        <img
          src={drop.image}
          alt={drop.projectName}
          className="nft-card-image"
        />
      )}
      <div className="nft-card-content">
        <h2>{drop.projectName}</h2>
        <p>Drop Type: {drop.dropType}</p>
        {renderPriceInfo()}
        <p>
          Date:{" "}
          {drop.date === "TBA"
            ? "TBA"
            : new Date(drop.date).toLocaleDateString()}
        </p>
        <p>Time: {drop.time}</p>
        <p>Supply: {drop.supply}</p>
        <p>Likes: {likesCount}</p>
        {onLike && (
          <button
            onClick={() => {
              if (typeof onLike === "function") {
                onLike(drop._id);
              } else {
                console.error("onLike is not a function");
              }
            }}
          >
            Like
          </button>
        )}
        {userRole === "admin" && !drop.approved && onApprove && (
          <button
            onClick={() => {
              if (typeof onApprove === "function") {
                onApprove(drop._id);
              } else {
                console.error("onApprove is not a function");
              }
            }}
          >
            Approve
          </button>
        )}
        {isProfilePage && (
          <button
            onClick={() => {
              window.location.href = `/edit/${drop._id}`;
            }}
          >
            Edit
          </button>
        )}
        <button onClick={toggleExpand}>
          {isExpanded ? "View Less" : "View More"}
        </button>
        <div className={`nft-card-details ${isExpanded ? "expanded" : ""}`}>
          {drop.description && <p>Description: {drop.description}</p>}
          {drop.website && (
            <p>
              Website:{" "}
              <a href={drop.website} target="_blank" rel="noopener noreferrer">
                {drop.website}
              </a>
            </p>
          )}
          {drop.xCom && (
            <p>
              X.com:{" "}
              <a href={drop.xCom} target="_blank" rel="noopener noreferrer">
                {drop.xCom}
              </a>
            </p>
          )}
          {drop.telegram && (
            <p>
              Telegram:{" "}
              <a href={drop.telegram} target="_blank" rel="noopener noreferrer">
                {drop.telegram}
              </a>
            </p>
          )}
          {drop.discord && (
            <p>
              Discord:{" "}
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
    dropType: PropTypes.string.isRequired,
    price: PropTypes.number,
    wlPrice: PropTypes.number,
    startingPrice: PropTypes.number,
    marketplaceLink: PropTypes.string,
    projectLink: PropTypes.string,
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
  onLike: PropTypes.func,
  onApprove: PropTypes.func,
  isProfilePage: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default NFTCard;
