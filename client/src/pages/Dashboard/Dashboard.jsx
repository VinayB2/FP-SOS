import DashboardNav from "./DashboardNav";
import { useState } from "react";
import Users from "./Users";
import Poles from "./Poles";

const Dashboard = () => {
  const [link, setLink] = useState("users");
  return (
    <div>
      <DashboardNav setLink={setLink} link={link} />
      {link == "users" ? <Users /> : <Poles />}
    </div>
  );
};

export default Dashboard;
