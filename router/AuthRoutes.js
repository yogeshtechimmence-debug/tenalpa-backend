import express from "express";
import { getProfile, loginUser, registerUser } from "../controller/authControllers.js";
import createMulter from "../middleware/upload.js";
import {verifyToken} from "../middleware/AuthMiddleware.js"

const router = express.Router();

const uploadUserImage = createMulter("UserImage"); // Folder: uploads/user/

router.post("/register", uploadUserImage.single("image"), registerUser);

router.post("/login", loginUser);

router.get("/getProfile", getProfile);

export default router;



