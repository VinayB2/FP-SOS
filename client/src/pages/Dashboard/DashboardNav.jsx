import React from "react";
import { NavLink } from "react-router-dom";
import "../css/dashboardNav.css";

const DashboardNav = ({ setLink, link }) => {
  return (
    <div className={"nav-bar"}>
      {["Users", "Poles"].map((text) => (
        <div
          key={text}
          onClick={() => setLink(text.toLowerCase())}
          className={link === text.toLowerCase() ? "active-nav" : "inactive-nav"}
        >
          {text}
        </div>
      ))}
    </div>
  );
};

export default DashboardNav;
