import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';
import { faShop } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Powered by Doginal Ducks</p>
        <ul className="social-links">
          <li>
            <a href="https://doginal-ducks-rarity.onrender.com/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faShop} />
            </a>
          </li>
          <li>
            <a href="https://x.com/dogepond" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </li>
          <li>
            <a href="https://discord.gg/RN2sUtz4CB" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faDiscord} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
