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

  const [orderStatus, setOrderStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = Date.now(); // Get the current timestamp
    const orderData = {
      ...formData,
      timestamp,
      limitPerMint: parseInt(formData.limitPerMint, 10) || 0, // Ensure integers
      maxNrOfMints: parseInt(formData.maxNrOfMints, 10) || 0, // Ensure integers
      mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) || 0 : undefined,
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) || 0 : undefined, // Added field
    };

    const orderResponse = await onSubmit(orderData);
    pollOrderStatus(orderResponse.index);
  };

  const pollOrderStatus = async (orderIndex) => {
    const interval = setInterval(async () => {
      const response = await fetch(`/order/status/${orderIndex}`);
      const data = await response.json();
      if (data.status === 'complete' || data.status === 'failed') {
        clearInterval(interval);
        setOrderStatus(data.status);
      }
    }, 5000); // Poll every 5 seconds
  };

  return (
    <form className="dune-form" onSubmit={handleSubmit}>
     <div className="info-note">
            <span className="info-icon">ℹ️</span>
            <p className="info-text">
              Etcher v1 is in beta. Not all dunes are available to etch/deploy due to issues around blockheight or if they have already been deployed. If your dune already exists or if there are blockheight issues, it will not be deployed, and you will lose your DOGE. You can check if a dune exists before deploying by searching for the dune in "All Dunes".
            </p>
          </div>
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
              onChange={(e) => handleChange(e)}
              required
            />
          </label>
          <label>
            Max Number of Mints:
            <input
              type="number"
              name="maxNrOfMints"
              value={formData.maxNrOfMints}
              onChange={(e) => handleChange(e)}
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

      <button type="submit">Submit</button>
      {orderStatus && <div>Order Status: {orderStatus}</div>}
    </form>
  );
};

export default DuneForm;
