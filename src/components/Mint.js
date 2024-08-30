import React from "react";
import "./Mint.css"; // Ensure to create a CSS file to style the components

const Mint = () => {
  return (
    <div className="mint-container">
      <h2 className="section-title">Upcoming Mints</h2>
      <div className="mint-section">
        <MintCard
          image="path_to_upcoming_image"
          title="Upcoming Project"
          description="Some details about the upcoming mint"
          buttonText="Learn More"
          buttonAction={() => alert("Learn more about Upcoming Project")}
        />
      </div>

      <h2 className="section-title">Minting Live</h2>
      <div className="mint-section">
        <MintCard
          image="path_to_live_mint_image"
          title="Live Mint Project"
          description="1 NFT costs 15 DOGE"
          buttonText="Mint Now"
          buttonAction={() => alert("Minting Now!")}
        />
      </div>

      <h2 className="section-title">Past Mints</h2>
      <div className="mint-section">
        <MintCard
          image="path_to_past_mint_image"
          title="Past Mint Project"
          description="158/2100 assets minted"
          buttonText="View"
          buttonAction={() => alert("Viewing Past Mint Project")}
        />
      </div>
    </div>
  );
};

const MintCard = ({ image, title, description, buttonText, buttonAction }) => {
  return (
    <div className="mint-card">
      <img src={image} alt={title} className="mint-card-image" />
      <div className="mint-card-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="mint-button" onClick={buttonAction}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Mint;
