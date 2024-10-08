import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://form.dogepond.com',  // Ensure this is the correct URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw new Error('An error occurred while submitting the order');
  }
};

export const checkOrderStatus = async (index) => {
  try {
    const response = await apiClient.get(`/order/status/${index}`);
    return response.data; // Return the full response data to access status, duneId, and txId
  } catch (error) {
    console.error('Error checking order status:', error);
    throw new Error('An error occurred while checking the order status');
  }
};
