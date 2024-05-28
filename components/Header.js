import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/signup">Sign Up</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/post">Post NFT Drop</Link></li>
    </ul>
  </nav>
);

export default Header;
