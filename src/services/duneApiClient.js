// src/services/duneApiClient.js
import axios from 'axios';

const duneApiClient = axios.create({
  baseURL: 'http://140.82.15.223:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const submitOrder = async (orderData) => {
  try {
    const response = await duneApiClient.post('/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error submitting order:', error);
    throw new Error('An error occurred while submitting the order');
  }
};

export const checkOrderStatus = async (index) => {
  try {
    const response = await duneApiClient.get(`/order/status/${index}`);
    return response.data.status;
  } catch (error) {
    console.error('Error checking order status:', error);
    throw new Error('An error occurred while checking the order status');
  }
};

export default duneApiClient;
