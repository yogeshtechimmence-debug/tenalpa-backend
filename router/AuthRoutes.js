import express from "express";
import { loginUser, registerUser } from "../controller/authControllers.js";
import createMulter from "../middleware/upload.js";

const router = express.Router();

const uploadUserImage = createMulter("UserImage"); // Folder: uploads/user/

router.post("/register", uploadUserImage.single("user_image"), registerUser);

router.post("/login", loginUser);


export default router;



