import React from 'react';
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
import { AuthProvider } from './context/AuthContext';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
