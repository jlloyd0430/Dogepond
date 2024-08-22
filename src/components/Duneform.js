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

  const [orderStatus, setOrderStatus] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [myDogeMask, setMyDogeMask] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);

  useEffect(() => {
    window.addEventListener('doge#initialized', () => {
      setMyDogeMask(window.doge);
    }, { once: true });

    if (window.doge?.isMyDoge) {
      setMyDogeMask(window.doge);
    }
  }, []);

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
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.operationType === 'mint' && (formData.numberOfMints > 12 || formData.numberOfMints < 1)) {
      alert('Number of mints must be between 1 and 12.');
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
      const orderResponse = await onSubmit(orderData);

      // Debugging step to check what the function actually returns
      console.log('Order response:', orderResponse);

      if (orderResponse && orderResponse.paymentAddress && orderResponse.dogeAmount) {
        if (connectedAddress) {
          try {
            const txReqRes = await myDogeMask.requestTransaction({
              recipientAddress: orderResponse.paymentAddress,
              dogeAmount: orderResponse.dogeAmount,
            });
            console.log('Transaction successful:', txReqRes);
          } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please try again.');
          }
        } else {
          alert(`Please connect your wallet or manually send ${orderResponse.dogeAmount} DOGE to ${orderResponse.paymentAddress}.`);
        }
      } else {
        throw new Error('Invalid order response');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  const pollOrderStatus = async (orderIndex) => {
    const interval = setInterval(async () => {
      const response = await fetch(`/order/status/${orderIndex}`);
      const data = await response.json();
      if (data.status === 'complete' || data.status === 'failed') {
        clearInterval(interval);
        setOrderStatus(data.status);
      }
    }, 5000);
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
              max="12"
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
