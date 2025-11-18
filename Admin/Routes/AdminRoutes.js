import express from "express";
import {
  deleteMultipleServices,
  getAllServices,
} from "../AdminController/GetAllServices.js";
import {
  deleteUsers,
  getAllUsers,
  getUserProfile,
  sendMail,
} from "../AdminController/GetAllUser.js";
import createMulter from "../../middleware/upload.js";
import {
  AllCategories,
  createCategory,
  deleteCategory,
  getSingleCategory,
  updateCategory,
} from "../AdminController/Category.js";
import {
  AddSubCategory,
  AllSubCategories,
  deleteSubCategory,
  getSingleSubCategory,
  updateSubCategory,
} from "../AdminController/SubCategory.js";
import {
  getBookings,
  getSingleBookings,
} from "../AdminController/AllBookingRequest.js";
import { registerUser } from "../../controller/Common/UserAuth.js";
import createAuthMulter from "../../middleware/UserAuthMulter.js";
import { getBanners } from "../../controller/User/BannerController.js";
import {
  createBanner,
  deleteBanner,
  getSingleBanner,
  updateBanner,
} from "../AdminController/Banner.js";
import {
  createPlan,
  deletePlan,
  planList,
  updatePlan,
} from "../AdminController/plan.js";
import { getSinglePage, updatePage } from "../AdminController/Page.js";

const router = express.Router();

// ------------------------ service controller ----------------------

router.get("/get_all_services", getAllServices);

router.post("/delete_multiple_services", deleteMultipleServices);



// ------------------------ all Booking controller ----------------------

router.get("/get_booking", getBookings);
router.get("/get_single_bookings", getSingleBookings);

// ------------------------ all user controller ----------------------

router.get("/get_all_users", getAllUsers);

router.post("/delete_users", deleteUsers);

router.post("/send_mail", sendMail);

router.get("/user_profile", getUserProfile);

router.post(
  "/add_user",
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

// ------------------------ Category controller ----------------------

const CategoryImage = createMulter("UserImage", "categoryImage");

router.post("/add_category", CategoryImage.single("image"), createCategory);

router.get("/get_category", AllCategories);

router.delete("/delete_category/:id", deleteCategory);

router.get("/get_single_category/:id", getSingleCategory);

router.put(
  "/update_category/:id",
  CategoryImage.single("image"),
  updateCategory
);

// ------------------------Sub Category controller ----------------------

const SubCategoryImage = createMulter("UserImage", "subCategory");

router.post(
  "/add_subcategory",
  SubCategoryImage.single("image"),
  AddSubCategory
);

router.get("/get_subcategory", AllSubCategories);

router.delete("/delete_subcategory/:id", deleteSubCategory);

router.get("/get_single_subcategory/:id", getSingleSubCategory);

router.put(
  "/update_subcategory/:id",
  SubCategoryImage.single("image"),
  updateSubCategory
);

// ------------------------Sub Category controller ----------------------
const BannerImage = createMulter("UserImage", "bannerImage");

router.post("/add_banner", BannerImage.single("image"), createBanner);
router.get("/get_banner", getBanners);
router.delete("/delete_banner", deleteBanner);
router.get("/get_single_banner", getSingleBanner);
router.put("/update_banner", BannerImage.single("image"), updateBanner);

// ------------------------Plan controller ----------------------

// Plan
router.post("/create", createPlan);
router.get("/list", planList);
router.delete("/delete/:planId", deletePlan);
router.put("/update/:planId", updatePlan);

// -----------------------------SinglePage-------------------------
router.get("/pages/:pageType",getSinglePage);
router.put("/pages/update/:pageType",updatePage);

export default router;
