import React, { useState } from 'react';
import './Trending.css';

const DuneForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    operationType: 'deploy',
    duneName: '',
    symbol: '',
    limitPerMint: '',
    maxNrOfMints: '',
    mintId: '',
    mintAmount: '',
    numberOfMints: '', // Added field
    mintToAddress: '',
    paymentAddress: '',
  });

  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const correctPassword = 'doginalsaredead'; // Replace with your desired password

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsPasswordVerified(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = Date.now(); // Get the current timestamp
    const orderData = { 
      ...formData, 
      timestamp,
      limitPerMint: parseInt(formData.limitPerMint, 10), // Ensure integers
      maxNrOfMints: parseInt(formData.maxNrOfMints, 10), // Ensure integers
      mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) : undefined,
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) : undefined, // Added field
    }; 
    onSubmit(orderData); // Submit the form data with the timestamp
  };

  return (
    <form className="dune-form" onSubmit={handleSubmit}>
      <label>
        Operation Type:
        <select name="operationType" value={formData.operationType} onChange={handleChange}>
          <option value="deploy">Deploy</option>
          <option value="mint">Mint</option>
        </select>
      </label>

      {formData.operationType === 'deploy' && (
        <>
          <label>
            Dune Name:
            <input
              type="text"
              name="duneName"
              value={formData.duneName}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'duneName',
                    value: e.target.value.toUpperCase().replace(/ /g, '•'),
                  },
                })
              }
              required
            />
          </label>
          <label>
            Symbol:
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Limit Per Mint:
            <input
              type="number"
              name="limitPerMint"
              value={formData.limitPerMint}
              onChange={(e) => handleChange({
                target: {
                  name: 'limitPerMint',
                  value: e.target.value,
                },
              })}
              required
            />
          </label>
          <label>
            Max Number of Mints:
            <input
              type="number"
              name="maxNrOfMints"
              value={formData.maxNrOfMints}
              onChange={(e) => handleChange({
                target: {
                  name: 'maxNrOfMints',
                  value: e.target.value,
                },
              })}
              required
            />
          </label>
        </>
      )}

      {formData.operationType === 'mint' && !isPasswordVerified && (
        <div>
          <label>
            Enter Password to Access Mint Section:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <button onClick={handlePasswordSubmit}>Submit Password</button>
        </div>
      )}

      {formData.operationType === 'mint' && isPasswordVerified && (
        <>
          <label>
            Mint ID:
            <input
              type="text"
              name="mintId"
              value={formData.mintId}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Amount to Mint:
            <input
              type="number"
              name="mintAmount"
              value={formData.mintAmount}
              onChange={(e) => handleChange({
                target: {
                  name: 'mintAmount',
                  value: e.target.value,
                },
              })}
              required
            />
          </label>
          <label>
            Number of Mints: {/* Added field */}
            <input
              type="number"
              name="numberOfMints"
              value={formData.numberOfMints}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            To Address:
            <input
              type="text"
              name="mintToAddress"
              value={formData.mintToAddress}
              onChange={handleChange}
              required
            />
          </label>
        </>
      )}

      <button type="submit" disabled={formData.operationType === 'mint' && !isPasswordVerified}>
        Submit
      </button>
    </form>
  );
};

export default DuneForm;
