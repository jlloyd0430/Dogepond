import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient'; // Import the apiClient
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Signup.css'; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { handleDiscordLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/signup', formData);
      console.log('Signup response:', response.data);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleDiscordLoginButton = () => {
    window.location.href = 'https://doginal-drc-20-drops-backend.onrender.com/api/auth/discord';
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
        or
        <button
          type="button"
          onClick={handleDiscordLoginButton}
          className="discord-login-button"
        >
          Signup with Discord
        </button>
      </form>
    </div>
  );
};

export default Signup;
