// mydoge.js

// Function to get the MyDoge wallet address
export async function getMyDogeWalletAddress() {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const account = await window.myDoge.connect();
    if (!account || !account.address) {
      throw new Error('Failed to retrieve account address');
    }
    return account.address;
  } catch (err) {
    throw new Error('User did not grant access to MyDoge Wallet');
  }
}

// Function to send DOGE from MyDoge wallet
export async function sendDogeFromMyDoge(amount, address) {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const txid = await window.myDoge.requestTransaction({
      recipientAddress: address,
      dogeAmount: amount,
    });
    return txid;
  } catch (err) {
    throw new Error(`Failed to send DOGE: ${err.message}`);
  }
}

// Function to fetch wallet data from MyDoge
export async function getWalletDataFromMyDoge(address) {
  try {
    const response = await fetch(`https://dogeturbo.ordinalswallet.com/wallet/${address}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch wallet data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Error fetching wallet data: ${err.message}`);
  }
}

// Function to get the balance from MyDoge wallet
export async function getBalanceFromMyDoge() {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const balance = await window.myDoge.getBalance();
    return balance;
  } catch (err) {
    throw new Error(`Failed to get balance: ${err.message}`);
  }
}

// Function to request a DRC-20 transaction from MyDoge wallet
export async function requestDrc20Transaction(ticker, amount, address) {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const txid = await window.myDoge.requestAvailableDRC20Transaction({
      ticker,
      amount,
      recipientAddress: address,
    });
    return txid;
  } catch (err) {
    throw new Error(`Failed to request DRC-20 transaction: ${err.message}`);
  }
}

// Function to request an inscription transaction from MyDoge wallet
export async function requestInscriptionTransaction(recipientAddress, output) {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const txid = await window.myDoge.requestInscriptionTransaction({
      recipientAddress,
      output,
    });
    return txid;
  } catch (err) {
    throw new Error(`Failed to request inscription transaction: ${err.message}`);
  }
}

// Function to sign a PSBT using MyDoge wallet
export async function requestPsbt(rawTx, indexes) {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const txid = await window.myDoge.requestPsbt({
      rawTx,
      indexes,
    });
    return txid;
  } catch (err) {
    throw new Error(`Failed to sign PSBT: ${err.message}`);
  }
}

// Function to sign a message using MyDoge wallet
export async function requestSignedMessage(message) {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const signedMessage = await window.myDoge.requestSignedMessage({
      message,
    });
    return signedMessage;
  } catch (err) {
    throw new Error(`Failed to sign message: ${err.message}`);
  }
}

// Function to get the transaction status using MyDoge wallet
export async function getTransactionStatus(txId) {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const txStatus = await window.myDoge.getTransactionStatus({ txId });
    return txStatus;
  } catch (err) {
    throw new Error(`Failed to get transaction status: ${err.message}`);
  }
}
