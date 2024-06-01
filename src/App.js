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
import Packages from './components/Packages'; 
import Fish from './components/Fish'; // Import the Fish component
import Footer from './components/Footer'; // Import the Footer component
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import './App.css';
import './components/NFTCard.css';
import './components/Footer.css';

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
      <div className="app">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route index element={<Profile />} /> {/* This should be relative */}
            </Route>
            <Route path="/dashboard" element={<PrivateRoute requiredRole="admin" />}>
              <Route index element={<Dashboard />} /> {/* This should be relative */}
            </Route>
            <Route path="/post" element={<PrivateRoute />}>
              <Route index element={<PostForm />} /> {/* This should be relative */}
            </Route>
            <Route path="/settings" element={<Settings />} /> {/* Add the settings route */}
            <Route path="/fish" element={<Fish />} /> {/* Add the Fish route */}
          </Routes>
        </div>
        <Footer /> {/* Add the Footer component here */}
      </div>
    </Router>
  );
};

export default App;