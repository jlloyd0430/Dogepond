import React, { useState } from 'react';
import apiClient from '../services/apiClient';

const CreateProposal = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['']);
  const [endDate, setEndDate] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [weightInputs, setWeightInputs] = useState({});

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

  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      options,
      endDate,
      collectionName,
      weightInputs,
    };

    await apiClient.post('/proposals/create', payload);
    alert('Proposal created successfully!');
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
      <button onClick={handleSubmit}>Create Proposal</button>
    </div>
  );
};

export default CreateProposal;
