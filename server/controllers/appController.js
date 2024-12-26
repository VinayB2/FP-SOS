import Pole from "../models/poles.js";
import User from "../models/users.js";
import { broadcastAlert } from "../index.js";
import bcrypt from "bcrypt";

export const addPole = async (req, res) => {
  try {
    const { poleId, cameraUrl, latitude, longitude, address } = req.body;
    if (!poleId || !cameraUrl || !latitude || !longitude || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingPole = await Pole.findOne({ poleId });
    if (existingPole) {
      return res
        .status(400)
        .json({ success: false, message: "Pole already exists" });
    }
    const newPole = new Pole({
      poleId,
      cameraUrl,
      latitude,
      longitude,
      address,
    });
    await newPole.save();
    res.json({ success: true, message: "Pole added successfully" });
  } catch (error) {    
    res.status(500).json({ success: false, message: "Failed to add pole" });
  }
};

export const getPole = async (req, res) => {
  try {
    if (!req.query.poleId) {
      return res
        .status(400)
        .json({ success: false, message: "Pole ID is required" });
    }
    const pole = await Pole.findOne({ poleId: req.query.poleId });
    if (!pole) {
      return res
        .status(201)
        .json({ success: false, message: "Pole not found" });
    }
    res.json({ success: true, pole });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get camera URL" });
  }
};

export const getPoleList = async (req, res) => {
  try {
    const poles = await Pole.find();
    if (!poles) {
      return res.status(404).json({ success: false, message: "No pole found" });
    }
    res.json({ success: true, poles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get pole list" });
  }
};

export const deletePole = async (req, res) => {
  try {
    const { poleId } = req.params;
    await Pole.findOneAndDelete({ poleId });
    res.json({ success: true, message: "Pole deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete pole" });
  }
};

export const updatePole = async (req, res) => {
  try {
    const { poleId, cameraUrl, latitude, longitude, address, isAlerted } = req.body;
    if (!poleId) {
      return res.status(400).json({ success: false, message: "Pole ID is required" });
    }
    const updatedPole = await Pole.findOneAndUpdate({ poleId }, { cameraUrl, latitude, longitude, address, isAlerted }, { new: true });
    if (!updatedPole) {
      return res.status(404).json({ success: false, message: "Pole not found" });
    }
    res.json({ success: true, updatedPole });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to update pole" });
  }
};

// export const alert = async (req, res) => {
//   try {
//     const { poleId } = req.params;
//     const pole = await Pole.findOne({ poleId });
//     if (!pole) {
//       return res.status(404).json({ success: false, message: "Pole not found" });
//     }
//     res.json({ success: true, pole });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to get alert" });
//   }
// };
export const alert = async (req, res) => {
  try {
    const {poleId} = req.params;
    console.log(poleId);
    const pole = await Pole.findOne({ poleId });

    if (!pole) {
      return res.status(404).json({ success: false, message: "Pole not found" });
    }
    pole.isAlerted = true;
    await pole.save();
    const alertMessage = {
      type: "ALERT",
      poleId: pole.poleId,
      cameraUrl: pole.cameraUrl,
      location: {
        latitude: pole.latitude,
        longitude: pole.longitude,
        address: pole.address,
      },
    };

    broadcastAlert(alertMessage);

    res.json({ success: true, message: "Alert broadcasted successfully", alert: alertMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to trigger alert" });
  }
};
export const unAlert = async (req, res) => {
  try {
    const {poleId} = req.params;
    console.log(poleId);
    const pole = await Pole.findOne({ poleId });
    pole.isAlerted = false;
    await pole.save();
    res.json({ success: true, message: "Alert removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove alert" });
  }
};
export const alertedPoles = async (req, res) => {
  try {
    const alertedPoles = await Pole.find({ isAlerted: true });
    if (!alertedPoles.length) {
      return res.status(200).json({ success: true, poles: [] });
    }
    res.json({ success: true, poles: alertedPoles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch alerted poles" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username);
    await User.findOneAndDelete({ username });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export const getUserList = async (req, res) => {
  try {
    const users = await User.find();
    users.forEach((user) => {
      user.password = undefined;
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user list" });
  }
};

export const test = async (req, res) => {
  try {
    console.log(req.query.poleId);
    res.json({ success: true, message: req.query.poleId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to trigger alert" });
  }
};