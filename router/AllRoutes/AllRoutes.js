import express from "express";
import userRoutes from "../UserRoutes/userRoutes.js";
import venderRoutes from "../VenderRoutes/venderRoutes.js"
import commonRoutes from "../CommonRoutes/authRoute.js"
import chatRoutes from "../ChatRoutes/ChatRoutes.js"

const router = express.Router();

router.use(userRoutes);
router.use(venderRoutes);
router.use(commonRoutes);
router.use(chatRoutes);

export default router;
