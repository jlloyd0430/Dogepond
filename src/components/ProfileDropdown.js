import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './ProfileDropdown.css'; // Import the CSS file

const ProfileDropdown = () => {
  const { auth, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="profile-dropdown">
      <FontAwesomeIcon icon={faUserCircle} className="profile-icon" onClick={toggleDropdown} />
      {isOpen && (
        <div className="dropdown-menu">
          <Link to="/profile" className="dropdown-item">Profile</Link>
          <Link to="/packages" className="dropdown-item">Services</Link>
          <Link to="/settings" className="dropdown-item">Settings</Link>
          {auth.user && auth.user.role === 'admin' && (
            <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
          )}
          <button className="dropdown-item-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
