import express from "express";
import { authCheck, loginUser, logout, registerUser } from "../controllers/auth.controllers.js";
import protectRoutes from "../middlewares/protectRoutes.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protectRoutes, logout); // only loggedIn users can logout.
router.get("/authCheck", protectRoutes, authCheck);

export default router;