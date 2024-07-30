// mydoge.js

// Function to get the MyDoge wallet address
export async function getMyDogeWalletAddress() {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const accounts = await window.myDoge.connect();
    if (accounts.length !== 1) {
      throw new Error(`Invalid number of accounts detected (${accounts.length})`);
    }
    return accounts[0].address;
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
    const txid = await window.myDoge.requestTransaction({ recipientAddress: address, dogeAmount: amount });
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
    const txid = await window.myDoge.requestAvailableDRC20Transaction({ ticker, amount, recipientAddress: address });
    return txid;
  } catch (err) {
    throw new Error(`Failed to request DRC-20 transaction: ${err.message}`);
  }
}
