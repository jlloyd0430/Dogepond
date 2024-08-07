import React from 'react';
import './Packages.css';
const Packages = () => {
  // Function now accepts a URL as a parameter
  const handleButtonClick = (url) => {
    window.location.href = url;
  };
  return (
    <div className="packages-container">
      <h1 className="packages-title">Service Packages</h1>
      <p className="packages-description">
        DogePond offers a variety of different Services for individuals and Projects alike.
      </p>
    <div className="services">
      <div className="package">
        <h2 className="package-title">Rarity site</h2>
        <p className="package-description">
          We will build you a webpage for your project to check the rarity of your traits & individual inscriptions in your collection.
        </p>
        {/* Pass specific URL to the function */}
        <button onClick={() => handleButtonClick('https://docs.google.com/forms/d/e/1FAIpQLScr3IFJQ3IjA55QKVUXcCXwvAlOJW2uHGVW25XKsxfnDhWHrg/viewform?usp=sf_link')} className="enquire-button">Enquire</button>
      </div>
      <div className="package">
        <h2 className="package-title">Launchpad Services</h2>
        <div className="package-description">
          A full minting resource for your project from start to finish
          Offering, truly automated minting experiences.
          <ul>
            <li>minting page</li>
            <li>Inscription services</li>
            <li>Resizing/Compression</li>
            <li>Etching Dunes</li>
            <li>Large file sizes</li>
            <li>Collection generation</li>
            <li>All Marketplace Metadata</li>
          </ul>
          {/* Pass another specific URL to the function */}
          <button onClick={() => handleButtonClick('https://docs.google.com/forms/d/e/1FAIpQLSeZTbkLO_8_nD2ZciRj0TccZwbzjBEwmbcIqdggGD5CFOnfRQ/viewform?usp=sf_link')} className="enquire-button">Enquire</button>
        </div>
      </div>
      <div className="package">
        <h2 className="package-title">Advertising/Marketing</h2>
        <div className="package-description">
          <h3>Banner Ads</h3>
          <p>
            Banner Ads are a great way to get your project in front of the Doginal Community. Our Banner pool is front and centre of the Home page as users browse the§ site!
          </p>
          <h3>Promotions</h3>
          <p>
            We offer collaboration and engagement opportunities for projects looking for social media clout and growth.
          </p>
          {/* And yet another URL */}
          <button onClick={() => handleButtonClick('https://docs.google.com/forms/d/e/1FAIpQLSfv5WILBl9pXQjYDzDbKeE_eg0kOpdY3852gnZkUs82UxBGZQ/viewform?usp=sf_link')} className="enquire-button">Enquire</button>
        </div>
      </div>
            <div className="package">
        <h2 className="package-title">Art Services</h2>
        <div className="package-description">
          <h3>Art Studio</h3>
          <p>
           we offer high quality art as a service, starting out with an idea for a collection but dont know where to start?  We got you! 2d and pixelated art services available now.
          </p>
          {/* And yet another URL */}
          <button onClick={() => handleButtonClick('https://discord.gg/jPeSRqkUpe')} className="enquire-button">Enquire</button>
        </div>
      </div>
            <div className="package">
        <h2 className="package-title">Dogepond Bot Services</h2>
        <div className="package-description">
          <h3>   Offering </h3>
          <ul>
            <li>Dogepond Bot</li>
            <li>General Tools bot</li>
            <li>Doginal WL bot</li>
            <li>OW Sales bot</li>
            <li>DM Sales bot</li>
            <li>DING wallet tracking</li>
            <li>Trending24 Alpha Bot</li>
            <li>Wallet Verification bot</li>
            <li>Custom bots at your request</li>  
          </ul>
          <p>
            Building bots to make a better doginal experience
          </p>
          {/* And yet another URL */}
          <button onClick={() => handleButtonClick('')} className="enquire-button">Enquire</button>
        </div>
      </div>
      <h1>HOLDER DISCOUNTS </h1>
      <p>DoginalDuck holders will receive discounted rates for service packages per duck up to 5 ducks. Rates may vary per package/custom job.</p>
    </div>
  </div>
  );
};
export default Packages;
