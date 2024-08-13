import React, { useState } from 'react';
import './Trending.css';
import axios from 'axios'; // Importing axios

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
    paymentAddress: '',
  });

  const [orderResult, setOrderResult] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      const result = await onSubmit(orderData);

      if (!result || typeof result.id === 'undefined') {
        throw new Error('Order ID is missing in the backend response.');
      }

      setOrderResult(result);
      setOrderStatus('pending');

      pollOrderStatus(result.id);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const pollOrderStatus = (orderId) => {
    const id = setInterval(async () => {
      try {
        const response = await axios.get(`/order/status/${orderId}`);
        const status = response.data.status;
        setOrderStatus(status);
        if (status !== 'pending') {
          clearInterval(id);
          setIntervalId(null);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    }, 10000);

    setIntervalId(id);
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

      {orderResult && (
        <div className="order-result">
          <h3>Order Result</h3>
          <p><strong>Order Status:</strong> {orderStatus}</p>
          {orderResult.paymentAddress && (
            <p>
              <strong>Payment Address:</strong>
              <input
                type="text"
                value={orderResult.paymentAddress}
                readOnly
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(orderResult.paymentAddress);
                  alert("Payment Address copied!");
                }}
              >
                Copy Address
              </button>
            </p>
          )}
          {orderResult.dogeAmount && <p><strong>Doge Amount:</strong> {orderResult.dogeAmount}</p>}
        </div>
      )}
    </form>
  );
};

export default DuneForm;
