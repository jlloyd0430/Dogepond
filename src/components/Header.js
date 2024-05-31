// src/components/Header.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './Header.css';

const Header = () => {
  const { auth } = useContext(AuthContext);

  return (
    <header className="header">
     <Link className="title" to="/"> <h1>DogePond</h1></Link>
      <nav className="nav">
        {/* <Link className="nav-link" to="/">Home</Link> */}
        {auth.isAuthenticated ? (
          <>
            <Link className="nav-link" to="/post">Post</Link> {/* Add the Post link for authenticated users */}
            {/* <button className="nav-button" onClick={logout}>Logout</button> */}
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/signup">Signup</Link>
          </>
        )}
          {auth.isAuthenticated && <ProfileDropdown />} {/* Conditionally render ProfileDropdown */}
      </nav>
    </header>
  );
};

export default Header;
