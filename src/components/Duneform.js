import React, { useState, useEffect } from 'react';
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

  const [orderStatus, setOrderStatus] = useState('');
  const [pendingOrders, setPendingOrders] = useState([]); // To store pending orders from backend

  // Fetch pending orders from backend on component mount
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await fetch('/api/pendingOrders'); // Ensure this route exists on your backend
        if (response.ok) {
          const orders = await response.json();
          setPendingOrders(orders);
        } else {
          console.error('Error fetching pending orders:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      }
    };

    fetchPendingOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.operationType === 'deploy' && !formData.maxNrOfMints) {
      alert('Max Number of Mints is required');
      return;
    }

    try {
      const response = await fetch('/api/createOrder', { // Ensure this route exists on your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, mintingAllowed: true }),
      });

      if (response.ok) {
        const order = await response.json();
        setOrderStatus(order.status);
        setPendingOrders([...pendingOrders, order]); // Add the new order to the pending orders list
      } else {
        console.error('Error creating order:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
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
      {pendingOrders.length > 0 && (
        <div className="pending-orders">
          {pendingOrders.map((order, index) => (
            <div key={index} className="order">
              <p>Please send {order.dogeAmount} DOGE to the following address:</p>
              <p>{order.paymentAddress}</p>
              <button onClick={() => navigator.clipboard.writeText(order.paymentAddress)}>Copy Address</button>
              <p>Order Status: {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuneForm;
