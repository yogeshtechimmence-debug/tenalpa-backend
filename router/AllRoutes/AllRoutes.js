import express from "express";
import userRoutes from "../UserRoutes/userRoutes.js";
import vendorRoutes from "../VendorRoutes/vendorRoutes.js"
import commonRoutes from "../CommonRoutes/authRoute.js"
import chatRoutes from "../ChatRoutes/ChatRoutes.js"

const router = express.Router();

router.use(userRoutes);
router.use(vendorRoutes);
router.use(commonRoutes);
router.use(chatRoutes);

export default router;
