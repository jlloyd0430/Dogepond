import React, { useState, useEffect } from 'react';
import './Trending.css';
import axios from 'axios';

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

  const [orderResult, setOrderResult] = useState(null); // Store order result
  const [orderStatus, setOrderStatus] = useState(null); // Store order status
  const [duneId, setDuneId] = useState(null); // Store Dune ID
  const [txId, setTxId] = useState(null); // Store Transaction ID

  // To store the interval ID so it can be cleared later
  let intervalId = null;

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
      limitPerMint: parseInt(formData.limitPerMint, 10), // Ensure integers
      maxNrOfMints: parseInt(formData.maxNrOfMints, 10), // Ensure integers
      mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) : undefined,
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) : undefined, // Added field
    }; 
    try {
      const result = await onSubmit(orderData); // Submit the form data with the timestamp
      setOrderResult(result); // Save the result to display later
      setOrderStatus('pending'); // Initially set the order status to pending

      // Start polling for order status
      pollOrderStatus(result.index);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const pollOrderStatus = (orderIndex) => {
    intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`/order/status/${orderIndex}`);
        const status = response.data.status;
        setOrderStatus(status); // Update the status
        if (status !== 'pending') {
          clearInterval(intervalId); // Stop polling if the status is no longer pending
          
          // Fetch additional information like Dune ID and Transaction ID
          const additionalInfoResponse = await axios.get(`/order/info/${orderIndex}`);
          setDuneId(additionalInfoResponse.data.duneId);
          setTxId(additionalInfoResponse.data.txId);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    }, 10000); // Poll every 10 seconds
  };

  // Clean up the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

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

      <button type="submit">Submit</button>

      {orderResult && (
        <div className="order-result">
          <h3>Order Result</h3>
          <p><strong>Order Status:</strong> {orderStatus}</p>
          {duneId && <p><strong>Dune ID:</strong> {duneId}</p>}
          {txId && <p><strong>Transaction ID:</strong> {txId}</p>}
        </div>
      )}
    </form>
  );
};

export default DuneForm;
