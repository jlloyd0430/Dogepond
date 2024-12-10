import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: true,
    user: null
  });

  const fetchUser = async (token) => {
    if (token) {
      try {
        const response = await axios.get('https://doginal-drc-20-drops-backend.onrender.com/api/auth', {
          headers: { 'x-auth-token': token }
        });
        setAuth((prevAuth) => ({
          ...prevAuth,
          isAuthenticated: true,
          loading: false,
          user: response.data
        }));
      } catch (error) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          isAuthenticated: false,
          loading: false,
          user: null
        }));
        console.error('Error fetching user:', error);
      }
    } else {
      setAuth((prevAuth) => ({ ...prevAuth, loading: false }));
    }
  };

  useEffect(() => {
    fetchUser(auth.token);
  }, [auth.token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://doginal-drc-20-drops-backend.onrender.com/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      setAuth((prevAuth) => ({
        ...prevAuth,
        token: response.data.token,
        isAuthenticated: true,
        loading: false,
        user: response.data.user
      }));
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setAuth((prevAuth) => ({
        ...prevAuth,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      }));
    }
  };

  const handleDiscordLogin = async (token) => {
    localStorage.setItem('token', token);
    await fetchUser(token);
    setAuth((prevAuth) => ({
      ...prevAuth,
      token: token,
      isAuthenticated: true,
      loading: false,
    }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth((prevAuth) => ({
      ...prevAuth,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null
    }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, handleDiscordLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
