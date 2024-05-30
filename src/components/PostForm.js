import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient'; // Import the apiClient
import './PostForm.css'; // Import the CSS file

const PostForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    price: '',
    wlPrice: '',
    date: '',
    time: '',
    supply: '', // Add supply field
  });
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
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const response = await apiClient.post('/nftdrops', formData, config); // Use apiClient
      console.log('Submitted post response:', response.data);
      alert('Submission successful! Await approval.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="post-form-container">
      <form className="post-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="projectName" 
          placeholder="Project Name" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="number" 
          name="price" 
          placeholder="Price" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="number" 
          name="wlPrice" 
          placeholder="Whitelist Price" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="date" 
          name="date" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="time" 
          name="time" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="number" 
          name="supply" 
          placeholder="Supply" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
