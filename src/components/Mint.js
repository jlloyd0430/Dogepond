import React from "react";
import "./Mint.css"; // Ensure to create a CSS file to style the components

const Mint = () => {
  return (
    <div className="mint-container">
      <h2 className="section-title">Upcoming Mints</h2>
      <div className="mint-section">
        {/* No cards for this section currently */}
      </div>

      <h2 className="section-title">Minting Live</h2>
      <div className="mint-section">
        <MintCard
          image="path_to_live_mint_image"
          title="Doginal Pengz"
          description="Doginal Pengz is a collection of 4200 penguins on DOGE 2100 supply is minting woth dogepond"
          Supply="2100"
          WL Price= "10 Doge"
          Price="15 Doge"
          buttonText="Mint Here"
          buttonAction={() => alert("Minting Now!")}
        />
      </div>

      <h2 className="section-title">Past Mints</h2>
      <div className="mint-section">
        {/* No cards for this section currently */}
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



import React from "react";
import "./Mint.css";

const Mint = () => {
  return (
    <div className="mint-container">
      <h2 className="section-title">Upcoming Mints</h2>
      <div className="mint-section">
        {/* No cards for this section currently */}
      </div>

      <h2 className="section-title">Minting Live</h2>
      <div className="mint-section">
        <MintCard
          image="/pengz.webp" // Image from the public folder
         title="Doginal Pengz"
          description="Doginal Pengz is a collection of 4200 penguins on DOGE 2100 supply is minting woth dogepond"
          Supply="2100"
          WL Price= "10 Doge"
          Price="15 Doge"
          buttonText="Mint Now"
          buttonAction={() => window.location.href = "https://doginalpengzmint.vercel.app/"}
        />
      </div>

      <h2 className="section-title">Past Mints</h2>
      <div className="mint-section">
        {/* No cards for this section currently */}
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
