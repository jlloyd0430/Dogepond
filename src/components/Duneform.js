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
    mintToAddress: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.operationType === 'deploy' && !formData.maxNrOfMints) {
      alert('Max Number of Mints is required');
      return;
    }
    onSubmit({ ...formData, mintingAllowed: true }); // Force mintingAllowed to true
  };

  return (
    <div className="dune-form-container">
      <div className="info-note">
        <span className="info-icon">ℹ️</span>
        <p className="info-text">
          Etcher v1 is in beta. Not all dunes are available to etch/deploy due to issues around blockheight or if they have already been deployed. If your dune already exists or if there are blockheight issues, it will not be deployed, and you will lose your DOGE. You can check if a dune exists before deploying by searching for the dune in "All Dunes".
        </p>
      </div>
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
                onChange={(e) => handleChange({ target: { name: 'duneName', value: e.target.value.toUpperCase().replace(/ /g, '•') } })}
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
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Max Number of Mints:
              <input
                type="number"
                name="maxNrOfMints"
                value={formData.maxNrOfMints}
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}
        {formData.operationType === 'mint' && (
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DuneForm;
