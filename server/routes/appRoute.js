import express from "express";
import { addPole, getPole, deletePole, updatePole, getPoleList, alert, test, alertedPoles, unAlert, addUser, deleteUser, getUserList } from "../controllers/appController.js";
import { authorizeAdmin } from "../controllers/authControllers.js";

const router = express.Router();

// User
router.get("/get-pole", getPole);
router.post("/delete-pole/:poleId", deletePole);
router.get("/get-pole-list", getPoleList);
router.get("/alerted-poles", alertedPoles);


router.get("/un-alert/:poleId", unAlert);

// ESP32-CAM
router.post("/update-pole", updatePole);
router.get("/alert/:poleId", alert);

// Admin
router.post("/add-pole", authorizeAdmin, addPole);
router.post("/add-user", authorizeAdmin, addUser);
router.get("/delete-user/:username", authorizeAdmin, deleteUser);
router.get("/get-user-list", authorizeAdmin, getUserList);

router.post("/test", test);
export default router;