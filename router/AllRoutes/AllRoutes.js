import express from "express";
import userRoutes from "../UserRoutes/userRoutes.js";
import venderRoutes from "../VenderRoutes/venderRoutes.js"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/vendor", venderRoutes);

export default router;
