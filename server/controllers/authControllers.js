import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    user.password = undefined;
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(401).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const isAdminLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Not an admin" });
    }
    res.status(200).json({ success: true, message: "Admin is logged in" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const isUserLoggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(200)
        .json({ success: false, message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found" });
    }
    res.status(200).json({ success: true, message: "User is logged in" });
  } catch (error) {
    console.error("Error in isUserLoggedIn:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const authorizeUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const authorizeAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const test = async (req, res, next) => {
  res.status(200).json({ message: "User logged in successfully" });
};
