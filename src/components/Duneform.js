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
    limitPerMint: parseInt(formData.limitPerMint, 10), // Ensure integers
    maxNrOfMints: parseInt(formData.maxNrOfMints, 10), // Ensure integers
    mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) : undefined,
    numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) : undefined, // Added field
  }; 

  try {
    setOrderStatus('pending'); // Immediately set status to pending
    const orderResponse = await onSubmit(orderData);

    // Log the response to inspect its structure
    console.log("Order Response:", orderResponse);

    if (!orderResponse || typeof orderResponse.index === 'undefined') {
      console.error('Order response is undefined or does not contain index.');
      throw new Error("Order response is undefined or does not contain index.");
    }
    
    pollOrderStatus(orderResponse.index);
  } catch (error) {
    console.error('Error submitting order:', error);
    setOrderStatus('failed');
  }
};


  try {
    setOrderStatus('pending'); // Immediately set status to pending
    const orderResponse = await onSubmit(orderData);
    console.log("Order Response:", orderResponse);

    if (!orderResponse || typeof orderResponse.index === 'undefined') {
      throw new Error("Order response is undefined or does not contain index.");
    }
    
    pollOrderStatus(orderResponse.index);
  } catch (error) {
    console.error('Error submitting order:', error);
    setOrderStatus('failed');
  }
};


    try {
      setOrderStatus('pending'); // Immediately set status to pending
      const orderResponse = await onSubmit(orderData);
      console.log("Order Response:", orderResponse);
      
      if (!orderResponse || !orderResponse.index) {
        throw new Error("Order response is undefined or does not contain index.");
      }
      
      pollOrderStatus(orderResponse.index);
    } catch (error) {
      console.error('Error submitting order:', error);
      setOrderStatus('failed');
    }
  };

  const pollOrderStatus = async (orderIndex) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/order/status/${orderIndex}`);
        const data = await response.json();
        console.log("Polling Order Status:", data);

        if (data.status === 'complete' || data.status === 'failed') {
          clearInterval(interval);
          setOrderStatus(data.status);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
        setOrderStatus('failed');
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds
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
      {orderStatus && <div>Order Status: {orderStatus}</div>}
    </form>
  );
};

export default DuneForm;
