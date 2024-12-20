import React, { useState, useEffect, useRef } from 'react';
import './Trending.css';
import { submitOrder, checkOrderStatus } from '../services/duneApiClient';
import axios from 'axios';

const DuneForm = () => {
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
  
  const debounceRef = useRef(null); // Move useRef inside the component

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

    // Cleanup debounce timeout on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const fetchDuneDataByName = async (duneName) => {
    try {
      const formattedName = duneName.toUpperCase().replace(/ /g, '•');
      const response = await axios.get(
        `https://xdg-mainnet.gomaestro-api.org/v0/assets/dunes/${formattedName}`,
        {
          headers: {
            Accept: 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        }
      );

      const duneData = response.data?.data;
      if (!duneData || !duneData.terms) {
        throw new Error('Dune data or terms missing.');
      }

      setFormData((prevData) => ({
        ...prevData,
        mintId: duneData.id,
        mintAmount: duneData.terms.amount_per_mint,
      }));
    } catch (error) {
      console.error('Error fetching dune data by name:', error);
      alert('Could not find Dune. Please check the name and try again.');
    }
  };

  const handleDebouncedFetch = (duneName) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (duneName) {
        fetchDuneDataByName(duneName);
      }
    }, 1000); // Adjust debounce delay as needed
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'duneName') {
      handleDebouncedFetch(value);
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




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.operationType === 'mint' && (formData.numberOfMints > 20 || formData.numberOfMints < 1)) {
      alert('Number of mints must be between 1 and 20.');
      return;
    }

    const timestamp = Date.now();
    const orderData = {
      ...formData,
      timestamp,
      limitPerMint: parseInt(formData.limitPerMint, 10) || 0,
      maxNrOfMints: parseInt(formData.maxNrOfMints, 10) || 0,
      mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) || 0 : undefined,
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) || 0 : undefined,
      mintAbsoluteStartBlockHeight: parseInt(formData.mintAbsoluteStartBlockHeight, 10) || null,
      mintAbsoluteStopBlockHeight: parseInt(formData.mintAbsoluteStopBlockHeight, 10) || null,
      mintRelativeStartBlockHeight: parseInt(formData.mintRelativeStartBlockHeight, 10) || null,
      mintRelativeEndBlockHeight: parseInt(formData.mintRelativeEndBlockHeight, 10) || null,
      optInForFutureProtocolChanges: formData.optInForFutureProtocolChanges,
      mintingAllowed: formData.mintingAllowed,
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
        console.log(`Polling status for order ${orderIndex}: ${data.status}`); // Log status
        if (data.status === 'complete') {
          setOrderStatus('complete');
          clearInterval(interval); // Stop polling once completed
        } else if (data.status === 'failed') {
          setOrderStatus('failed');
          clearInterval(interval); // Stop polling if it fails
        } else {
          setOrderStatus(data.status); // Update status if still pending
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
    onChange={(e) =>
      handleChange({
        target: {
          name: 'duneName',
          value: e.target.value.toUpperCase().replace(/ /g, '•'),
        },
      })
    }
    placeholder="Enter Dune Name"
    required
  />
</label>
    <label>
      Amount to Mint:
      <input
        type="text"
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
            onClick={() => navigator.clipboard.writeText(orderInfo.paymentAddress)}>
            Copy Address
          </button>
        </div>
      )}
      {orderStatus && <div>Order Status: {orderStatus}</div>}
    </form>
  );
};

export default DuneForm;
