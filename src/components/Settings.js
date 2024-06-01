import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
// import './Settings.css';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const handleThemeChange = (event) => {
    toggleTheme();
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="setting-item">
        <label>
          <input 
            type="checkbox" 
            checked={isDarkMode} 
            onChange={handleThemeChange} 
          />
          Dark Mode
        </label>
      </div>
    </div>
  );
};

export default Settings;
