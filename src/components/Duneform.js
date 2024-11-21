import React, { useState, useEffect } from 'react';
import './Trending.css';
import { submitOrder, checkOrderStatus } from '../services/duneApiClient';
import axios from 'axios';

const DuneForm = () => {
  const [formData, setFormData] = useState({
    operationType: 'deploy',
    duneName: '',
    duneId: '', // For storing the Dune ID fetched from the API
    symbol: '',
    limitPerMint: '',
    maxNrOfMints: '',
    mintAmount: '',
    numberOfMints: '',
    mintToAddress: '',
    paymentAddress: '',
    mintAbsoluteStartBlockHeight: '',
    mintAbsoluteStopBlockHeight: '',
    mintRelativeStartBlockHeight: '',
    mintRelativeEndBlockHeight: '',
    optInForFutureProtocolChanges: false,
    mintingAllowed: true,
  });

  const [orderInfo, setOrderInfo] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [myDogeMask, setMyDogeMask] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    window.addEventListener(
      'doge#initialized',
      () => {
        setMyDogeMask(window.doge);
      },
      { once: true }
    );

    if (window.doge?.isMyDoge) {
      setMyDogeMask(window.doge);
    }
  }, []);

const fetchDuneDataByName = async (duneName) => {
  try {
    const response = await axios.get(
      `https://xdg-mainnet.gomaestro-api.org/v0/assets/dunes?name=${duneName}`,
      {
        headers: {
          Accept: 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
      }
    );

    const duneData = response.data?.data[0]; // Get the first match from the response
    if (!duneData) {
      throw new Error('Dune not found');
    }

    setFormData((prevData) => ({
      ...prevData,
      duneId: duneData.id || '', // Store the fetched Dune ID
      mintAmount: duneData.terms?.amount_per_mint || 0, // Store the amount per mint or default to 0
    }));
  } catch (error) {
    console.error('Error fetching Dune details by name:', error);
    alert('Failed to fetch Dune details. Please check the Dune name.');
  }
};


  const handleConnectWallet = async () => {
    if (myDogeMask) {
      try {
        const connectRes = await myDogeMask.connect();
        setConnectedAddress(connectRes.address);
      } catch (error) {
        console.error('Failed to connect to MyDoge:', error);
      }
    } else {
      alert('MyDoge wallet extension not found');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'duneName') {
      // Convert spaces to `•` and force uppercase
      const formattedValue = value.toUpperCase().replace(/ /g, '•');
      setFormData((prevData) => ({ ...prevData, duneName: formattedValue }));

      // Fetch Dune data when the name changes
      if (formattedValue) {
        fetchDuneDataByName(formattedValue);
      }
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.operationType === 'mint' && (formData.numberOfMints > 25 || formData.numberOfMints < 1)) {
      alert('Number of mints must be between 1 and 25.');
      return;
    }

    const orderData = {
      operationType: formData.operationType,
      duneId: formData.duneId, // Send the Dune ID to the backend
      mintAmount: parseInt(formData.mintAmount, 10),
      numberOfMints: parseInt(formData.numberOfMints, 10),
      mintToAddress: formData.mintToAddress,
    };

    try {
      const orderResponse = await submitOrder(orderData);

      if (orderResponse && orderResponse.address && orderResponse.dogeAmount) {
        setOrderInfo({
          paymentAddress: orderResponse.address,
          dogeAmount: orderResponse.dogeAmount,
          orderIndex: orderResponse.index,
        });
        setOrderStatus('pending');

        if (connectedAddress) {
          try {
            const txReqRes = await myDogeMask.requestTransaction({
              recipientAddress: orderResponse.address,
              dogeAmount: orderResponse.dogeAmount,
            });
            console.log('Transaction successful:', txReqRes);
          } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please try again.');
          }
        }

        // Start polling for order status after submitting the order
        startPolling(orderResponse.index);
      } else {
        throw new Error('Invalid order response');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  const startPolling = (orderIndex) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const data = await checkOrderStatus(orderIndex);
        if (data.status === 'complete') {
          setOrderStatus('complete');
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setOrderStatus('failed');
          clearInterval(interval);
        } else {
          setOrderStatus(data.status);
        }
      } catch (error) {
        console.error('Error polling order status:', error);
      }
    }, 5000);

    setPollingInterval(interval);
  };

  return (
    <form className="dune-form" onSubmit={handleSubmit}>
      <div className="info-note">
        <span className="info-icon" onClick={() => setShowInfo(!showInfo)}>ℹ️</span>
        <button type="button" onClick={handleConnectWallet} className="connect-wallet-button">
          {connectedAddress ? `Connected: ${connectedAddress}` : 'Connect Wallet'}
        </button>
        {showInfo && (
          <p className={`info-text ${showInfo ? 'visible' : ''}`}>
            Etcher v1 is in beta. Not all dunes are available to etch/deploy due to issues around blockheight or if they have already been deployed. If your dune already exists or if there are blockheight issues, it will not be deployed, and you will lose your DOGE. You can check if a dune exists before deploying by searching for the dune in "All Dunes".
          </p>
        )}
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
              onChange={handleChange}
              placeholder="Enter Dune Name"
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
          <label>
            <input
              type="checkbox"
              name="showAdvanced"
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
            />
            Show Advanced Options
          </label>
          {showAdvanced && (
            <div className="advanced-options">
              <label>
                Mint Absolute Start Block Height:
                <input
                  type="number"
                  name="mintAbsoluteStartBlockHeight"
                  value={formData.mintAbsoluteStartBlockHeight}
                  onChange={handleChange}
                />
              </label>
              <label>
                Mint Absolute Stop Block Height:
                <input
                  type="number"
                  name="mintAbsoluteStopBlockHeight"
                  value={formData.mintAbsoluteStopBlockHeight}
                  onChange={handleChange}
                />
              </label>
              <label>
                Mint Relative Start Block Height:
                <input
                  type="number"
                  name="mintRelativeStartBlockHeight"
                  value={formData.mintRelativeStartBlockHeight}
                  onChange={handleChange}
                />
              </label>
              <label>
                Mint Relative End Block Height:
                <input
                  type="number"
                  name="mintRelativeEndBlockHeight"
                  value={formData.mintRelativeEndBlockHeight}
                  onChange={handleChange}
                />
              </label>
              <label>
                Opt-In for Future Protocol Changes:
                <input
                  type="checkbox"
                  name="optInForFutureProtocolChanges"
                  checked={formData.optInForFutureProtocolChanges}
                  onChange={handleChange}
                />
              </label>
              <label>
                Minting Allowed:
                <input
                  type="checkbox"
                  name="mintingAllowed"
                  checked={formData.mintingAllowed}
                  onChange={handleChange}
                />
              </label>
            </div>
          )}
        </>
      )}
      {formData.operationType === 'mint' && (
        <>
          <label>
            Dune Name:
            <input
              type="text"
              name="duneName"
              value={formData.duneName}
              onChange={handleChange}
              placeholder="Enter Dune Name"
              required
            />
          </label>
          <label>
            Amount to Mint:
            <input
              type="number"
              name="mintAmount"
              value={formData.mintAmount}
              readOnly
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
              max="25"
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
      {orderInfo && (
        <div>
          <p>
            Please send {orderInfo.dogeAmount} DOGE to the following address:
            <br />
            {orderInfo.paymentAddress}
          </p>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(orderInfo.paymentAddress)}
          >
            Copy Address
          </button>
        </div>
      )}
      {orderStatus && <div>Order Status: {orderStatus}</div>}
    </form>
  );
};

export default DuneForm;
