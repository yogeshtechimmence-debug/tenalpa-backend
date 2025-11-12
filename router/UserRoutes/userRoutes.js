import express from "express";
import createMulter from "../../middleware/upload.js";
import { createBanner,getBanners,} from "../../controller/User/BannerController.js";
import { getAllCategories,} from "../../controller/User/HomeCategory.js";
import { AddSubCategory,GetSubCategory,} from "../../controller/User/SubCategory.js";
import { DeleteJob,getQuotes,getSingleJob,PostJob,} from "../../controller/User/JobPostController.js";
import { getUserRequests,SendRequest,} from "../../controller/Vendor/RequestController.js";
import { getAllServices } from "../../controller/Vendor/AddServicesController.js";
import { quoteBooking } from "../../controller/User/UserBooking.js";
import { addRating, getRatings, getRatingsByService } from "../../controller/User/RatingController.js";
import { DeleteReschedule, GetReschedule, RescheduleService } from "../../controller/User/Reschedule.js";
import { FilterService } from "../../controller/User/FilterController.js";

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


// ---------------- services Route -----------------------


router.get("/filter-service", FilterService);


// ---------------- reting Route -----------------------

const ratingImage = createMulter("VendorImage", "ratingImage");

router.post("/add_rating", ratingImage.array("image", 5), addRating);

router.get("/get_rating", getRatings);

router.get("/get_service_rating", getRatingsByService);

// ---------------- UserBooking Route -----------------------

router.post("/quote_booking", quoteBooking);


// ---------------- Address Route -----------------------

router.post("/add_reschedule", RescheduleService)
router.get("/get_reschedule", GetReschedule)
router.delete("/delete_reschedule", DeleteReschedule);


// ---------------- PostJob Route -----------------------

const PostJobImage = createMulter("UserImage", "PostJobImage");

router.post("/add_postjob", PostJobImage.array("image", 5), PostJob);
router.get("/get_single_job", getSingleJob);
router.get("/get_quote", getQuotes);
router.delete("/delete_postjob", DeleteJob);



export default router;
