import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/login.css";
const Login = ({isLoggedIn, setIsLoggedIn}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await axios.post(`/api/auth/login`, { username, password });
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsLoggedIn(true);
      navigate("/");
    }
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
