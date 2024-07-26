import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './Header.css';

const Header = () => {
  const { auth } = useContext(AuthContext);

  return (
    <header className="header">
      <Link className="title" to="/">
        <h1>DogePond</h1>
      </Link>
      <nav className="nav">
        {auth.isAuthenticated ? (
          <>
            <Link className="nav-link" to="/post">Post</Link>
            <Link className="nav-link" to="/fish">Fish</Link>
            <Link className="nav-link" to="/proposals">Vote</Link>
            <Link className="nav-link" to="/info">Hot</Link> {/* Add link to Info page */}
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/signup">Signup</Link>
            <Link className="nav-link" to="/packages">Services</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
