import React from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ onToggle, isOpen, isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <button onClick={onToggle} className="sidebar-toggle-button">
        {isOpen ? <FaTimes className="icon-close" /> : <FaBars className="icon-open" />}
      </button>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <a href="/" className="sidebar-title">FP-SOS</a>
        {isLoggedIn && (
          ['Surveillance', 'Alerts', 'Monitor', 'Maps' , 'Dashboard'].map((text) => (
            <NavLink
              key={text}
              to={`/${text.toLowerCase()}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active-link' : 'inactive-link'}`
              }
            >
              {text}
            </NavLink>
          ))
        )}
        {!isLoggedIn ? (
          <NavLink to="/login" className="sidebar-link login-link">Login</NavLink>
        ) : (
          <button className="sidebar-button" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </>
  );
};

export default Sidebar;