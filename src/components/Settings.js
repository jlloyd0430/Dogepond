import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../App.css'; // Add this for your settings page styles

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="dark-mode-toggle">
        <label>
          <input 
            type="checkbox" 
            checked={isDarkMode} 
            onChange={toggleDarkMode} 
          />
          Dark Mode
        </label>
      </div>
    </div>
  );
};

export default Settings;
