import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PostForm from "./components/PostForm";
import EditForm from "./components/EditForm"; // Import the EditForm component
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Packages from "./components/Packages";
import Fish from "./components/Fish";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import "./App.css";
import "./components/NFTCard.css";
import "./components/Footer.css";

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
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
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
              <Route index element={<Profile />} />
            </Route>
            <Route
              path="/dashboard"
              element={<PrivateRoute requiredRole="admin" />}
            >
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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
