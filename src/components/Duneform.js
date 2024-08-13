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
    numberOfMints: '',
    mintToAddress: '',
    paymentAddress: '',
  });

  const [orderResult, setOrderResult] = useState(null); // Store order result
  const [orderStatus, setOrderStatus] = useState(null); // Store order status

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
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) : undefined,
    }; 
    const result = await onSubmit(orderData); // Submit the form data with the timestamp
    setOrderResult(result); // Save the result to display later
    setOrderStatus('pending'); // Initially set the order status to pending

    // Start polling for order status
    pollOrderStatus(result.index);
  };

  const pollOrderStatus = (orderIndex) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`/order/status/${orderIndex}`);
        const status = response.data.status;
        setOrderStatus(status); // Update the status
        if (status !== 'pending') {
          clearInterval(intervalId); // Stop polling if the status is no longer pending
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    }, 10000); // Poll every 10 seconds
  };

  return (
    <form className="dune-form" onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit">Submit</button>

      {orderResult && (
        <div className="order-result">
          <h3>Order Result</h3>
          <p><strong>Order Status:</strong> {orderStatus}</p>
          <p><strong>Dune ID:</strong> {orderResult.duneId}</p>
          <p><strong>Transaction ID:</strong> {orderResult.txId}</p>
        </div>
      )}
    </form>
  );
};

export default DuneForm;
