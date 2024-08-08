import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://d86f-2001-19f0-0-4782-5400-5ff-fe0b-4549.ngrok-free.app/', // Replace with the current ngrok URL
  headers: {
    'Content-Type': 'application/json'
  }
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
    return response.data.status;
  } catch (error) {
    console.error('Error checking order status:', error);
    throw new Error('An error occurred while checking the order status');
  }
};
