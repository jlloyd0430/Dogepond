import React from "react";
import "./Mint.css";

const Mint = () => {
  return (
    <div className="mint-container">
      <h2 className="section-title">Upcoming Mints</h2>
      <div className="mint-section">
        <MintCard
          image="/doginalduck.webp" // Image from the public folder
          title="Dingin Ducks"
          description="Dingin Ducks is an upcoming collection of 3333 Ducks by Doginal ducks, created in an effort to expand exclusive access to our unique applications, tooling and community."
          Supply="3333"
          WLPrice="33 Doge"
          Price="40 Doge"
          buttonText="Learn More"
          buttonAction={() => alert("More details coming soon!")}
        />
      </div>

      <h2 className="section-title">Minting Live</h2>
      <div className="mint-section">
        {/* No cards for this section currently */}
      </div>

      <h2 className="section-title">Past Mints</h2>
      <div className="mint-section">
        <MintCard
          image="/peng.webp" // Image from the public folder
          title="Doginal Pengz"
          description="Doginal Pengz is a collection of 4200 penguins on DOGE 2100 supply is minting with dogepond"
          Supply="2100"
          WLPrice="10 Doge"
          Price="15 Doge"
          buttonText="View Details"
          buttonAction={() => alert("Details about this past mint coming soon!")}
        />
      </div>
    </div>
  );
};

const MintCard = ({ image, title, description, Supply, WLPrice, Price, buttonText, buttonAction }) => {
  return (
    <div className="mint-card">
      <img src={image} alt={title} className="mint-card-image" />
      <div className="mint-card-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <p><strong>Supply:</strong> {Supply}</p>
        <p><strong>WL Price:</strong> {WLPrice}</p>
        <p><strong>Price:</strong> {Price}</p>
        <button className="mint-button" onClick={buttonAction}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Mint;
