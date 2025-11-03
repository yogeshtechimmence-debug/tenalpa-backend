import express from "express";
import createMulter from "../../middleware/upload.js";
import {
  createBanner,
  getBanners,
} from "../../controller/User/BannerController.js";
import {
  addUserAddress,
  getUserAddressById,
  updateUserAddress,
} from "../../controller/Common/UserAddressController.js";
import {
  createCategory,
  getAllCategories,
} from "../../controller/User/HomeCategory.js";
import {
  AddSubCategory,
  GetSubCategory,
} from "../../controller/User/SubCategory.js";
import {
  DeleteJob,
  getQuotes,
  PostJob,
} from "../../controller/User/JobPostController.js";
import {
  getUserRequests,
  SendRequest,
} from "../../controller/Vender/RequestController.js";
import { getAllServices } from "../../controller/Vender/AddServicesController.js";
import { quoteBooking } from "../../controller/User/UserBooking.js";
import { GetUserNotification } from "../../controller/User/UserNotificationController.js";

const router = express.Router();

// ---------------- Banner Route -----------------------

const BannerImage = createMulter("UserImage", "bannerImage");

router.post(
  "/add_banner",
  BannerImage.fields([
    { name: "image", maxCount: 1 },
    { name: "complate_image", maxCount: 1 },
  ]),
  createBanner
);

router.get("/get_banner", getBanners);

// ---------------- Category Route -----------------------

const CategoryImage = createMulter("UserImage", "categoryImage");

router.post("/add_category", CategoryImage.single("image"), createCategory);
router.get("/get_all_categories", getAllCategories);

// ----------------Sub Category Route -----------------------

const SubCategoryImage = createMulter("UserImage", "subCategory");

router.post(
  "/add_sub_category",
  SubCategoryImage.single("image"),
  AddSubCategory
);
router.get("/get_sub_category", GetSubCategory);

// ---------------- Request Route -----------------------

router.post("/send_request", SendRequest);
router.get("/get_user_request", getUserRequests);

// ---------------- services Route -----------------------

router.get("/get_all_services", getAllServices);

// ---------------- UserBooking Route -----------------------

router.post("/quote_booking", quoteBooking);

// ---------------- PostJob Route -----------------------

const PostJobImage = createMulter("UserImage", "PostJobImage");

router.post("/add_postjob", PostJobImage.array("image", 5), PostJob);
router.get("/get_quote", getQuotes);
router.delete("/delete_postjob", DeleteJob);

// ---------------- Address Route -----------------------

router.get("/get_user_notification", GetUserNotification);

// ---------------- Address Route -----------------------

router.post("/add_user_address", addUserAddress);
router.get("/get_user_address", getUserAddressById);
router.get("/update_user_address", updateUserAddress);

export default router;
