import express from "express";
import { deleteMultipleServices, getAllServices } from "../AdminController/GetAllServices.js";
import { deleteUsers, getAllUsers, getUserProfile, sendMail } from "../AdminController/GetAllUser.js";
import createMulter from "../../middleware/upload.js";
import { AllCategories, createCategory, deleteCategory, getSingleCategory, updateCategory } from "../AdminController/Category.js";
import { AddSubCategory, AllSubCategories, deleteSubCategory, getSingleSubCategory, updateSubCategory } from "../AdminController/SubCategory.js";

const router = express.Router();

// ------------------------ service controller ----------------------
router.get("/get-all-services", getAllServices);

router.post("/delete-multiple-services", deleteMultipleServices);


// ------------------------ all user controller ----------------------

router.get("/get-all-users", getAllUsers);

router.post("/delete-users", deleteUsers );

router.post("/send-mail", sendMail);

router.get("/user-profile", getUserProfile);


// ------------------------ Category controller ----------------------


const CategoryImage = createMulter("UserImage", "categoryImage");

router.post("/add_category", CategoryImage.single("image"), createCategory);

router.get("/get_category", AllCategories);

router.delete("/delete_category/:id", deleteCategory);

router.get("/get_single_category/:id", getSingleCategory);

router.put("/update_category/:id",CategoryImage.single("image"), updateCategory);


// ------------------------Sub Category controller ----------------------


const SubCategoryImage = createMulter("UserImage", "subCategory");

router.post("/add_subcategory", SubCategoryImage.single("image"), AddSubCategory);

router.get("/get_subcategory", AllSubCategories);

router.delete("/delete_subcategory/:id", deleteSubCategory);

router.get("/get_single_subcategory/:id", getSingleSubCategory);

router.put("/update_subcategory/:id",CategoryImage.single("image"), updateSubCategory);

export default router;
