import express from "express";
import dynamicUpload from "../middleware/uploadMiddleware.js";
import { loginUser, registerUser } from "../controller/UserAuth.js";
import {
  changePassword,
  forgetPassword,
} from "../controller/UserForgetPassword.js";
import {
  addUserAddress,
  getUserAddressById,
  updateUserAddress,
} from "../controller/UserAddressController.js";

const router = express.Router();

// ----------------  Auth Route -----------------------

router.post("/register", dynamicUpload, registerUser);
router.post("/login", loginUser);

// ---------------- forget Password Route -----------------------

router.post("/forget_password", forgetPassword);
router.post("/change_password", changePassword);

// ---------------- Address Route -----------------------

router.post("/add_user_address", addUserAddress);
router.get("/get_user_address", getUserAddressById);
router.get("/update_user_address", updateUserAddress);

export default router;
