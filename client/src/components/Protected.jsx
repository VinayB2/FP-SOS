import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Protected = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data } = await axios.get(`/api/auth/is-user-logged-in`, {
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
      }
    };

    checkLoginStatus();
  }, [navigate]);

  if (isLoggedIn === null) {
    // Wait until login status is determined
    return null;
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default Protected;