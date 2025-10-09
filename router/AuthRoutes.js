import express from "express";
import { getProfile, loginUser, registerUser, updateProfile } from "../controller/authControllers.js";
import createMulter from "../middleware/upload.js";
import { changePassword, forgetPassword } from "../controller/authForgetPassword.js";

const router = express.Router();

const uploadUserImage = createMulter("UserImage"); // Folder: uploads/user/

router.post("/register", uploadUserImage.single("image"), registerUser);

router.get("/login", loginUser);

router.get("/getProfile", getProfile);

router.post("/updateProfile", uploadUserImage.single("image"), updateProfile);

router.post("/forgetPassword", forgetPassword);

router.post("/changePassword", changePassword);


export default router;



