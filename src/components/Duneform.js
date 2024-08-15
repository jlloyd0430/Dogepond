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
    numberOfMints: '',
    mintToAddress: '',
  });

  const [orderStatus, setOrderStatus] = useState(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(true);
  const [password, setPassword] = useState('');
  const correctPassword = 'doginals are dead'; // Password to unlock the form

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
      setIsMaintenanceMode(false);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = Date.now();
    const orderData = {
      ...formData,
      timestamp,
      limitPerMint: parseInt(formData.limitPerMint, 10),
      maxNrOfMints: parseInt(formData.maxNrOfMints, 10),
      mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) : undefined,
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) : undefined,
    };

    try {
      setOrderStatus('pending');
      const orderResponse = await onSubmit(orderData);

      if (orderResponse && orderResponse.index) {
        // Poll for the order status using the returned index
        pollOrderStatus(orderResponse.index);
      } else {
        setOrderStatus('failed');
      }
    } catch (error) {
      setOrderStatus('failed');
      console.error('Error submitting order:', error);
    }
  };

  const pollOrderStatus = async (orderIndex) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/order/status/${orderIndex}`);
        const data = await response.json();

        if (data.status === 'complete' || data.status === 'failed') {
          clearInterval(interval);
          setOrderStatus(data.status);
        }
      } catch (error) {
        setOrderStatus('failed');
        clearInterval(interval);
      }
    }, 60000); // Poll every 60 seconds
  };

  return (
    <div className="dune-form-container">
      {isMaintenanceMode ? (
        <div className="maintenance-message">
          <h2>Dunes Etcher is under maintenance</h2>
          <p>Please enter the password to unlock the form.</p>
          <form onSubmit={handlePasswordSubmit}>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <button type="submit">Unlock</button>
          </form>
        </div>
      ) : (
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
                Number of Mints:
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
      )}
    </div>
  );
};

export default DuneForm;
