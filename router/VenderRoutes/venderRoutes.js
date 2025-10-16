import express from "express"
import createMulter from "../../middleware/upload.js";
import { AddServices, DeleteServices, GetServicesByVender, UpdateServices } from "../../controller/Vender/AddServicesController.js";

const router = express.Router();

// ----------------------- Vender services Routes -------------------------------------------

const ServicesUpload = createMulter("VenderImage", "servicesImage");

router.post("/add_services", ServicesUpload.array("image", 10), AddServices);
router.get("/get_services", GetServicesByVender);
router.put("/update_services", ServicesUpload.array("image", 10), UpdateServices);
router.delete("/delete_services", DeleteServices);




export default router;