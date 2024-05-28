import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  });

  useEffect(() => {
    if (auth.token) {
      axios
        .get('http://drc20calendar-32f6b6f7dd9e.herokuapp.com/api/auth', {
          headers: { 'x-auth-token': auth.token }
        })
        .then((response) => {
          setAuth({
            ...auth,
            isAuthenticated: true,
            loading: false,
            user: response.data
          });
        })
        .catch((error) => {
          setAuth({
            ...auth,
            isAuthenticated: false,
            loading: false,
            user: null
          });
          console.error('Error fetching user:', error);
        });
    } else {
      setAuth({ ...auth, loading: false });
    }
  }, [auth.token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://drc20calendar-32f6b6f7dd9e.herokuapp.com/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      setAuth({
        token: response.data.token,
        isAuthenticated: true,
        loading: false,
        user: response.data.user
      });
    } catch (error) {
      console.error('Login error:', error.response.data);
      setAuth({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
