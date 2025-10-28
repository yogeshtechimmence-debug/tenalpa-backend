import express from "express";
import userRoutes from "../UserRoutes/userRoutes.js";
import venderRoutes from "../VenderRoutes/venderRoutes.js"

const router = express.Router();

router.use(userRoutes);
router.use(venderRoutes);

export default router;
