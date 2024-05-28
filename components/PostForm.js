import React, { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    price: '',
    wlPrice: '',
    date: '',
    time: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Include the token in the request headers
        },
      };
      const response = await axios.post('http://localhost:5000/api/nftdrops', formData, config); // Make sure the URL is correct
      console.log('Submitted post response:', response.data); // Log response
      alert('Submission successful! Await approval.');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="projectName" placeholder="Project Name" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <input type="number" name="wlPrice" placeholder="Whitelist Price" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="time" name="time" onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
