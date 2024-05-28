// src/components/Header.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <h1 className="title">DRC Calendar</h1>
      <nav className="nav">
        <Link className="nav-link" to="/">Home</Link>
        {auth.isAuthenticated ? (
          <>
            {auth.user && auth.user.role === 'admin' && (
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            )}
            <Link className="nav-link" to="/post">Post</Link> {/* Add the Post link for authenticated users */}
            <button className="nav-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
