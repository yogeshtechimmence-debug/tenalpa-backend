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
} from "../../controller/UserAddressController.js";
import { createCategory, getAllCategories } from "../../controller/User/HomeCategory.js";
import { AddSubCategory, GetSubCategory } from "../../controller/User/SubCategory.js";
import { DeleteJob, getQuotes, PostJob } from "../../controller/User/JobPostController.js";

const router = express.Router();

// ---------------- Banner Route -----------------------

const BannerImage = createMulter("UserImage", "bannerImage");

router.post("/add_banner", BannerImage.single("image"), createBanner);
router.get("/get_banner", getBanners);

// ---------------- Category Route -----------------------

const CategoryImage = createMulter("UserImage", "categoryImage");

router.post("/add_category", CategoryImage.single("image"), createCategory);
router.get("/get_all_categories", getAllCategories);

// ----------------Sub Category Route -----------------------

const SubCategoryImage = createMulter("UserImage", "subCategory");

router.post("/add_sub_category", SubCategoryImage.single("image"), AddSubCategory);
router.get("/get_sub_category", GetSubCategory);

// ---------------- PostJobImage Route -----------------------

const PostJobImage = createMulter("UserImage", "PostJobImage");

router.post("/add_postjob", PostJobImage.array("image", 5), PostJob);
router.delete("/delete_postjob", DeleteJob);
router.get("/get_quote", getQuotes);


// ---------------- Address Route -----------------------

router.post("/add_user_address", addUserAddress);
router.get("/get_user_address", getUserAddressById);
router.get("/update_user_address", updateUserAddress);

export default router;
