import express from "express";
import { getAllServices } from "../AdminController/GetAllServices.js";

const router = express.Router();

// get All Services//
router.get("/get-all-services", getAllServices);

export default router;
