import express from "express";
import userRoutes from "../UserRoutes/userRoutes.js";
// import vendorRoutes from "./vendorRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
// router.use("/vendor", vendorRoutes);

export default router;
