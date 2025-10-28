import express from "express"
import createMulter from "../../middleware/upload.js";
import { AddServices, DeleteServices, getAllServices, GetServicesByVender, UpdateServices } from "../../controller/Vender/AddServicesController.js";
import { getAllJobs, SendQuote } from "../../controller/Vender/SendQuotController.js";
import { DeleteRequest, getRequests, SendRequest } from "../../controller/Vender/RequestController.js";
import { AcceptBooking, CancelBooking, getBookings } from "../../controller/Vender/VenderBooking.js";

const router = express.Router();

// ----------------------- Vender services Routes -------------------------------------------

const ServicesUpload = createMulter("VenderImage", "servicesImage");

router.post("/add_services", ServicesUpload.array("image", 10), AddServices);
router.get("/get_all_services", getAllServices);
router.get("/get_services", GetServicesByVender);
router.put("/update_services", ServicesUpload.array("image", 10), UpdateServices);
router.delete("/delete_services", DeleteServices);

// ---------------- Quot Route -----------------------

const QuotImage = createMulter("UserImage", "QuotImage");
router.post("/send_quote",  QuotImage.array("image", 5) ,SendQuote);
router.get("/get_all_quote", getAllJobs);


// ---------------- Send Route  -----------------------

router.post("/add_request", SendRequest);
router.get("/get_request", getRequests);
router.delete("/delete_request", DeleteRequest);


// ---------------- Send Route  -----------------------

router.post("/accept_booking", AcceptBooking);
router.get("/get_booking", getBookings);
router.post("/cancel_booking", CancelBooking);



export default router;