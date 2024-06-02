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
    supply: '',
    description: '', // Add description field
    website: '', // Add website field
    xCom: '', // Add X.com field
    telegram: '', // Add Telegram field
    discord: '', // Add Discord field
    image: null, // Add image field
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Debugging: Check the form data before sending
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await apiClient.post('/nftdrops', formDataToSend, config); // Correct endpoint usage
      console.log('Submitted post response:', response.data);
      alert('Submission successful! Await approval.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="post-form-container">
      <h1>Post your Mint</h1>
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
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="website"
          placeholder="Website URL"
          onChange={handleChange}
        />
        <input
          type="url"
          name="xCom"
          placeholder="X.com URL"
          onChange={handleChange}
        />
        <input
          type="url"
          name="telegram"
          placeholder="Telegram URL"
          onChange={handleChange}
        />
        <input
          type="url"
          name="discord"
          placeholder="Discord URL"
          onChange={handleChange}
        />
        <input 
          type="file" 
          name="image" 
          accept="image/*"
          onChange={handleChange}
        />
        <p>note: whitelistprice must be greater then 0. </p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
