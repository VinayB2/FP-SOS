import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminProtected = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data } = await axios.get(`/api/auth/is-admin-logged-in`, {
          withCredentials: true,
        });

        if (data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        navigate("/login");
      }
    };

    checkLoginStatus();
  }, [navigate]);

  if (isLoggedIn === null) {
    return null;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default AdminProtected;