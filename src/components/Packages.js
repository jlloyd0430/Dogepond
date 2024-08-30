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
        <h2 className="package-title">Node/Asset Services</h2>
        <div className="package-description">
          A full backend resource for your project from start to finish
          Offering full access to our node and more, we work with large file sizes,compression/sizing/generation, nd more!
          <ul>
            <li>Inscribing Collections</li>
            <li>Deploying tokens</li>
            <li>Resizing/Compression</li>
            <li>Collection generation</li>
            <li>All Marketplace Metadata</li>
          </ul>
          {/* Pass another specific URL to the function */}
          <button onClick={() => handleButtonClick('https://docs.google.com/forms/d/e/1FAIpQLSeZTbkLO_8_nD2ZciRj0TccZwbzjBEwmbcIqdggGD5CFOnfRQ/viewform?usp=sf_link')} className="enquire-button">Enquire</button>
        </div>
      </div>
   <div className="package">
        <h2 className="package-title">Dogepond Launchpad</h2>
        <div className="package-description">
          We are excited to offer our launchpad / minting services to the doginal community! no more inscribing and listing on the market when u can have a complete customizable mint page! here are the mint service our launchpad has to offer, all versions are mobile compatible! 
          <ul>
            <li>pre-inscribed, mintpad (assets sent in batches)</li>
            <li>Auto inscriber mints (inscribed directly to buyer)</li>
            <li>Native Token mints (pay with Drc-20)</li>
            <li>Custom mint page design</li>
            <li>Marketing boost</li>
          </ul>
          {/* Pass another specific URL to the function */}
          <button onClick={() => handleButtonClick('https://docs.google.com/forms/d/e/1FAIpQLSeZTbkLO_8_nD2ZciRj0TccZwbzjBEwmbcIqdggGD5CFOnfRQ/viewform?usp=sf_link')} className="enquire-button">Enquire</button>
        </div>
      </div>
      <div className="package">
        <h2 className="package-title">Web development</h2>
        <p className="package-description">
          We will build you a custom webpage for your Doge project wich includes
        </p>
          <ul>
            <li>Custom web services</li>
            <li>multiple pages</li>
            <li>wallet connect functionality</li>
            <li>Rarity checker</li>
          </ul>
        {/* Pass specific URL to the function */}
        <button onClick={() => handleButtonClick('https://docs.google.com/forms/d/e/1FAIpQLScr3IFJQ3IjA55QKVUXcCXwvAlOJW2uHGVW25XKsxfnDhWHrg/viewform?usp=sf_link')} className="enquire-button">Enquire</button>
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
           <p>
            Need help building hype for mint day? we will host a schedueld pump space day of mint with the community.
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
            <li>Dunes Bot</li>
            <li>General Tools bot</li>
            <li>Doginal WL bot</li>
            <li>OW Sales bot</li>
            <li>DM Sales bot</li>
            <li>DINGbot wallet tracker</li>
            <li>Dingbot Pro (holders only)</li>
            <li>Trending Volume 24 Alpha Bot</li>
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
