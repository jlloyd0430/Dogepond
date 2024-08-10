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

  const [paymentInfo, setPaymentInfo] = useState(null); // Add state for paymentInfo
  const [orderStatus, setOrderStatus] = useState(''); // Add state for orderStatus

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
    onSubmit({ ...formData, mintingAllowed: true });
    // Assuming paymentInfo and orderStatus would be set here after form submission
    setPaymentInfo({
      dogeAmount: 100, // Example value, replace with actual data
      address: 'D123456789ABCDEFGHJKLMNPQRSTUVWXYZ', // Example value, replace with actual data
    });
    setOrderStatus('Pending'); // Example status, replace with actual data
  };

  return (
    <div className="dune-form-container">
      <div className="info-note">
        <span className="info-icon">ℹ️</span>
        <p className="info-text">
          Etcher v1 is in beta. Not all dunes are available to etch/deploy due to issues around blockheight or if they have already been deployed. If your dune already exists or if there are blockheight issues, it will not be deployed, and you will lose your DOGE. You can check if a dune exists before deploying by searching for the dune in "All Dunes".
        </p>
      </div>
      <div className="under-maintenance-message">Under Maintenance</div>
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
      {paymentInfo && (
        <div className="trending-payment-popup">
          <p>Please send {paymentInfo.dogeAmount} DOGE to the following address:</p>
          <p>{paymentInfo.address}</p>
          <button onClick={() => navigator.clipboard.writeText(paymentInfo.address)}>Copy Address</button>
          {orderStatus && <p>Order Status: {orderStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default DuneForm;
