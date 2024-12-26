import React, { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const WebSocketContext = createContext();
const WebSocketProvider = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "ALERT") {
        console.log("Received ALERT message:", message);
        navigate("/alerts");
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    return () => {
      ws.close();
    };
  }, [navigate]);

  return (
    <WebSocketContext.Provider value={{}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;