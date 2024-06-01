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
            <Link className="nav-link" to="/post">Post</Link> {/* Authenticated users see Post link */}
            <Link className="nav-link" to="/fish">Fish</Link> {/* Authenticated users see Fish link */}
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/signup">Signup</Link>
            <Link className= "nav-link" to="/packages" >Services</Link>
          </>
        )}
        {auth.isAuthenticated && <ProfileDropdown />} {/* Conditionally render ProfileDropdown */}
      </nav>
    </header>
  );
};

export default Header;