import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://form.dogepond.com',  // Updated to use your domain
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

export const checkOrderStatus = async (orderId) => {  // Use orderId instead of index
  try {
    const response = await apiClient.get(`/order/status/${orderId}`);
    return response.data.status;
  } catch (error) {
    console.error('Error checking order status:', error);
    throw new Error('An error occurred while checking the order status');
  }
};
