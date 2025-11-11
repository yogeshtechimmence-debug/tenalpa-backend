import express from "express";
import { deleteMultipleServices, getAllServices } from "../AdminController/GetAllServices.js";
import { deleteUsers, getAllUsers } from "../AdminController/GetAllUser.js";

const router = express.Router();

// ------------------------ service controller ----------------------
// get All Services//
router.get("/get-all-services", getAllServices);
// delete multiple service
router.post("/delete-multiple-services", deleteMultipleServices);


// ------------------------ all user controller ----------------------

// get All User and Vendor//
router.get("/get-all-users", getAllUsers);
router.post("/delete-users", deleteUsers );


export default router;
