import express from "express";
// import dynamicUpload from "../middleware/uploadMiddleware.js";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controller/UserAuth.js";
import {
  changePassword,
  forgetPassword,
} from "../controller/UserForgetPassword.js";
import {
  addUserAddress,
  getUserAddressById,
  updateUserAddress,
} from "../controller/UserAddressController.js";
import createMulter from "../middleware/UserAuthMulter.js";


const router = express.Router();

// ----------------  Auth Route -----------------------

router.post("/signup", (req, res, next) => {
  const upload = createMulter();
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ status: 0, message: err.message });
    }
    next();
  });
}, registerUser);
router.post("/login", loginUser);
router.get("/get_profile", getUserProfile);

router.put(
  "/update_profile",
  (req, res, next) => {
    const upload = createMulter();
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ status: 11, message: err.message });
      }
      next();
    });
  },
  updateUserProfile
);


// ---------------- forget Password Route -----------------------

router.post("/forget_password", forgetPassword);
router.post("/change_password", changePassword);

// ---------------- Address Route -----------------------

router.post("/add_user_address", addUserAddress);
router.get("/get_user_address", getUserAddressById);
router.get("/update_user_address", updateUserAddress);

export default router;
