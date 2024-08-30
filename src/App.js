import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import "./App.css";
import "./components/NFTCard.css";
import "./components/Footer.css";
import Proposals from "./components/Proposals";
import Info from "./components/info";
import Mint from "./components/Mint"; // Import the Mint component

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { handleDiscordLogin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      handleDiscordLogin(token).then(() => {
        navigate("/"); // Redirect to home after storing token
      });
    }
  }, [location, handleDiscordLogin, navigate]);

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
          <Route path="/profile" element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="/dashboard" element={<PrivateRoute requiredRole="admin" />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/post" element={<PrivateRoute />}>
            <Route index element={<PostForm />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/fish" element={<Fish />} />
          <Route path="/edit/:id" element={<PrivateRoute />}>
            <Route index element={<EditForm />} />
          </Route>
          <Route path="/proposals" element={<PrivateRoute />}>
            <Route index element={<Proposals />} />
          </Route>
          <Route path="/info" element={<PrivateRoute />}>
            <Route index element={<Info />} />
          </Route>
          <Route path="/mint" element={<Mint />} /> {/* Add this route */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
