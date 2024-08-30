import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  const { auth } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <Link className="title" to="/">
        <h1>DogePond</h1>
      </Link>
      <nav className="nav">
        <FontAwesomeIcon
          icon={faBars}
          className="mobile-menu-icon"
          onClick={toggleMobileMenu}
        />
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {auth.isAuthenticated ? (
            <>
              <Link className="nav-link" to="/post">Post</Link>
              <Link className="nav-link" to="/proposals">Vote</Link>
              <Link className="nav-link" to="/mint">Mint</Link>
              <ProfileDropdown /> {/* Show the Profile Dropdown when logged in */}
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/signup">Signup</Link>
              <Link className="nav-link" to="/packages">Services</Link>
              <Link className="nav-link" to="/mint">Mint</Link>
            </>
          )}
        </div>
        {auth.isAuthenticated && (
          <FontAwesomeIcon
            icon={faUserCircle}
            className="profile-icon"
            onClick={toggleMobileMenu}
          />
        )}
      </nav>
    </header>
  );
};

export default Header;
