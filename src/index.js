import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root using React 18 API
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
