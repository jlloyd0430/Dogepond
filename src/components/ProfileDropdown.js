import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './ProfileDropdown.css'; // Import the CSS file

const ProfileDropdown = () => {
  const { logout } = useContext(AuthContext);
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
          <a href="/profile" className="dropdown-item">Profile</a>
          <a href='/packages' className="dropdown-item">Services</a>
          <a href="/settings" className="dropdown-item">Settings</a>
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
