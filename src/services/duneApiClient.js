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


export async function verifyMobileWallet({ walletAddress, isPolling, randomAmount }) {
  try {
    const response = await axios.post("https://form.dogepond.com/verify-payment", {
      walletAddress, // Ensure this is a valid string
      isPolling, // Pass true or false correctly
      randomAmount, // Optional: Include this if polling
    });
    return response.data; // Return response from backend
  } catch (error) {
    console.error("Error verifying mobile wallet:", error);
    throw new Error("Mobile wallet verification failed.");
  }
}

