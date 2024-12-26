import express from "express";
import { login, register, logout } from "../controllers/authControllers.js";
import { isAdminLoggedIn, isUserLoggedIn, test } from "../controllers/authControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/is-admin-logged-in", isAdminLoggedIn);
router.get("/is-user-logged-in", isUserLoggedIn);
router.get("/logout", logout);
router.get("/test", test);
export default router;