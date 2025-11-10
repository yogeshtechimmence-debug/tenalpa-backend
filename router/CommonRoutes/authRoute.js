import express from "express";
import {getAllUsers, getUserProfile,loginUser,registerUser,updateUserProfile,} from "../../controller/Common/UserAuth.js";
import {changePassword,forgetPassword,} from "../../controller/Common/UserForgetPassword.js";
import {addUserAddress,getUserAddressById,updateUserAddress,} from "../../controller/Common/UserAddressController.js";
import createAuthMulter from "../../middleware/UserAuthMulter.js";
import { GetUserNotification } from "../../controller/Common/UserNotificationController.js";

const router = express.Router();

// ----------------  Auth Route -----------------------

router.post(
  "/register",
  (req, res, next) => {
    const upload = createAuthMulter();
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ status: 0, message: err.message });
      }
      next();
    });
  },
  registerUser
);

router.get("/login", loginUser);
router.get("/get_all-user", getAllUsers);
router.get("/get_profile", getUserProfile);

router.put(
  "/update_profile",
  (req, res, next) => {
    const upload = createAuthMulter();
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

// ---------------- notification Route -----------------------


router.get("/get_user_notification", GetUserNotification);


// ---------------- Address Route -----------------------

router.post("/add_user_address", addUserAddress);
router.get("/get_user_address", getUserAddressById);
router.get("/update_user_address", updateUserAddress);

export default router;
