import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PostForm from './components/PostForm';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/dashboard" element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/post" element={<PrivateRoute />}>
            <Route path="/post" element={<PostForm />} />
          </Route>
          <Route path="/settings" element={<Settings />} /> {/* Add the settings route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
