import express from "express";
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
} from "../../controller/User/authControllers.js";
import createMulter from "../../middleware/upload.js";
import {
  changePassword,
  forgetPassword,
} from "../../controller/User/authForgetPassword.js";
import {
  createBanner,
  getBanners,
} from "../../controller/User/BannerController.js";
import {
  addUserAddress,
  getUserAddressById,
  updateUserAddress,
} from "../../controller/User/UserAddressController.js";

const router = express.Router();

// ---------------- Auth Route -----------------------

const UserProfile = createMulter("UserImage", "profileImage");

router.post("/signup", UserProfile.single("image"), registerUser);
router.get("/login", loginUser);
router.get("/get_profile", getProfile);
router.post("/update_profile", UserProfile.single("image"), updateProfile);
router.post("/forgot_password", forgetPassword);
router.post("/change_password", changePassword);

// ---------------- Banner Route -----------------------

const BannerImage = createMulter("UserImage", "bannerImage");

router.post("/add_banner", BannerImage.single("image"), createBanner);
router.get("/get_banner", getBanners);

// ---------------- Address Route -----------------------

router.post("/add_user_address", addUserAddress);
router.get("/get_user_address", getUserAddressById);
router.get("/update_user_address", updateUserAddress);

export default router;
