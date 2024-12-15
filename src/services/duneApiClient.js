import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://form.dogepond.com', // VPS backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Submit a new order
export const submitOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw new Error('An error occurred while submitting the order');
  }
};

// Check the status of an order
export const checkOrderStatus = async (index) => {
  try {
    const response = await apiClient.get(`/order/status/${index}`);
    return response.data; // Return the full response data
  } catch (error) {
    console.error('Error checking order status:', error);
    throw new Error('An error occurred while checking the order status');
  }
};

// Harvest dunes
export const harvestDunes = async (harvestData) => {
  try {
    const response = await apiClient.post('/harvest', harvestData);
    return response.data;
  } catch (error) {
    console.error('Error harvesting dunes:', error);
    throw new Error('Failed to harvest dunes.');
  }
};

// Verify mobile wallet payment
export const verifyMobileWallet = async (walletAddress) => {
  try {
    const response = await apiClient.post('/verify-payment', { walletAddress });
    return response.data; // Contains success status and verification amount
  } catch (error) {
    console.error('Error verifying mobile wallet:', error);
    throw new Error('Mobile wallet verification failed.');
  }
};

// Fetch wallet data
export const fetchWalletData = async (walletAddress) => {
  try {
    const response = await apiClient.post('/wallet/data', { walletAddress });
    return response.data; // Contains wallet balance and holdings
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    throw new Error('Failed to fetch wallet data.');
  }
};
