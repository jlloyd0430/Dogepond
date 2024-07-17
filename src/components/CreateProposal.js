import React, { useState } from 'react';
import axios from 'axios'; // Use axios for making HTTP requests

const CreateProposal = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['']);
  const [endDate, setEndDate] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [weightInputs, setWeightInputs] = useState({});
  const [image, setImage] = useState(null); // Add state for image file

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleWeightInputChange = (nft, weight) => {
    setWeightInputs({ ...weightInputs, [nft]: weight });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('options', JSON.stringify(options)); // Convert array to JSON string
    formData.append('endDate', endDate);
    formData.append('collectionName', collectionName);
    formData.append('weightInputs', JSON.stringify(weightInputs)); // Convert object to JSON string
    formData.append('image', image); // Append image file

    const token = localStorage.getItem('token'); // Get JWT token from local storage

    try {
      const response = await axios.post('https://drc20calendar-32f6b6f7dd9e.herokuapp.com/api/proposals/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      alert('Proposal created successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Error creating proposal');
    }
  };

  return (
    <div className="create-proposal-container">
      <h2>Create Proposal</h2>
      <input type="text" placeholder="Proposal Name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Proposal Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      {options.map((option, index) => (
        <input key={index} type="text" placeholder="Option" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
      ))}
      <button onClick={handleAddOption}>Add Option</button>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <input type="text" placeholder="Collection Name" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
      {Object.keys(weightInputs).map((nft, index) => (
        <div key={index}>
          <input type="text" placeholder="NFT" value={nft} onChange={(e) => handleWeightInputChange(e.target.value, weightInputs[nft])} />
          <input type="number" placeholder="Weight" value={weightInputs[nft]} onChange={(e) => handleWeightInputChange(nft, e.target.value)} />
        </div>
      ))}
      <input type="file" onChange={handleImageChange} /> {/* Input for image file */}
      <button onClick={handleSubmit}>Create Proposal</button>
    </div>
  );
};

export default CreateProposal;
