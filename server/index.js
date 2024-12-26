// import express from "express";
// import cors from "cors";
// import appRoute from "./routes/appRoute.js";
// import connectDB from "./db/connect.js";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.use(cors());
// connectDB();
// app.use(express.json());
// app.use("/api", appRoute);
// app.listen(process.env.PORT, () => {
//   console.log("Server is running on port 5000");
// });

import express from "express";
import cors from "cors";
import appRoute from "./routes/appRoute.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoutes.js";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
app.use(cors());
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use("/api", appRoute);
app.use("/api/auth", authRoute);
const server = createServer(app); // Create an HTTP server

// WebSocket Server Setup
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Function to broadcast alerts to all connected WebSocket clients
export const broadcastAlert = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
