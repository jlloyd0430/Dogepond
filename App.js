import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PostForm from "./components/PostForm";
import EditForm from "./components/EditForm";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Packages from "./components/Packages";
import Fish from "./components/Fish";
import Footer from "./components/Footer";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import Raffles from './components/Raffles';
import "./App.css";
import "./components/NFTCard.css";
import "./components/Footer.css";
import Proposals from "./components/Proposals"; // Import the Proposals component

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
  const { handleDiscordLogin, auth } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      console.log('Received Token:', token);
      handleDiscordLogin(token);
      window.location.href = '/dashboard'; // Redirect to dashboard after storing token
    }
  }, [location, handleDiscordLogin]);

  return (
    <div className="app">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/raffles" element={<Raffles />} />
          <Route path="/profile" element={
            <PrivateRoute isAuthenticated={auth.isAuthenticated}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute isAuthenticated={auth.isAuthenticated} requiredRole="admin">
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/post" element={
            <PrivateRoute isAuthenticated={auth.isAuthenticated}>
              <PostForm />
            </PrivateRoute>
          } />
          <Route path="/settings" element={<Settings />} />
          <Route path="/fish" element={<Fish />} />
          <Route path="/edit/:id" element={
            <PrivateRoute isAuthenticated={auth.isAuthenticated}>
              <EditForm />
            </PrivateRoute>
          } />
          <Route path="/proposals" element={
            <PrivateRoute isAuthenticated={auth.isAuthenticated}>
              <Proposals />
            </PrivateRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
