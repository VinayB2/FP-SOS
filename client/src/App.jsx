import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebSocketProvider from "./components/WebSocketProvider";
import Sidebar from "./components/Sidebar";
import Protected from "./components/Protected";
import AdminProtected from "./components/AdminProtected";
import Surveillance from "./pages/Surveillance";
import Login from "./pages/Login";
import Alerts from "./pages/Alerts";
import Monitor from "./pages/Monitor";
import Maps from "./pages/Maps";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <WebSocketProvider>
        <div className="app-container">
          <div className={`sidebar-container ${isOpen ? "" : "closed"}`}>
            <Sidebar
              onToggle={toggleSidebar}
              isOpen={isOpen}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </div>
          <div className={`content-container ${isOpen ? "narrow" : "wide"}`}>
            <Routes>
              <Route
                path="/login"
                element={
                  <Login
                    isOpen={isOpen}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                }
              />
              <Route
                path="/surveillance"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    <Surveillance />
                  </Protected>
                }
              />
              <Route
                path="/alerts"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    <Alerts />
                  </Protected>
                }
              />
              <Route
                path="/monitor"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    {" "}
                    <Monitor />{" "}
                  </Protected>
                }
              />
              <Route
                path="/maps"
                element={
                  <Protected isLoggedIn={isLoggedIn}>
                    {" "}
                    <Maps />
                  </Protected>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AdminProtected isLoggedIn={isLoggedIn}>
                    <Dashboard />
                  </AdminProtected>
                }
              />
            </Routes>
          </div>
        </div>
      </WebSocketProvider>
    </Router>
  );
}

export default App;
