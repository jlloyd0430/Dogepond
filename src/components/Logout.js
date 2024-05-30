import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Logout.css'; 

const Logout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button className="logout-button" onClick={logout}>Logout</button>
  );
};

export default Logout;
