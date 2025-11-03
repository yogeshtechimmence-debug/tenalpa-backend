import express from "express"
import createMulter from "../../middleware/upload.js";
import { AddServices, DeleteServices, GetServicesByVender, UpdateServices } from "../../controller/Vender/AddServicesController.js";
import { getAllJobs, SendQuote } from "../../controller/Vender/SendQuotController.js";
import { DeleteRequest, getVendorRequests } from "../../controller/Vender/RequestController.js";
import { AcceptBooking, CancelBooking, deleteAllVendorBookings, getBookings } from "../../controller/Vender/VenderBooking.js";

const router = express.Router();

// ----------------------- Vender services Routes -------------------------------------------

const ServicesUpload = createMulter("VenderImage", "servicesImage");

router.post("/add_services", ServicesUpload.array("image", 10), AddServices);
router.get("/get_services", GetServicesByVender);
router.put("/update_services", ServicesUpload.array("image", 10), UpdateServices);
router.delete("/delete_services", DeleteServices);

// ---------------- Quot Route -----------------------

const QuotImage = createMulter("UserImage", "QuotImage");
router.post("/send_quote",  QuotImage.array("image", 5) ,SendQuote);
router.get("/get_all_job", getAllJobs);


// ---------------- Send Route  -----------------------


router.get("/get_vendor_request", getVendorRequests);
router.delete("/delete_request", DeleteRequest);


// ---------------- Send Route  -----------------------

router.post("/accept_booking", AcceptBooking);
router.get("/get_booking", getBookings);
router.post("/cancel_booking", CancelBooking);
router.post("/delete_all_booking", deleteAllVendorBookings);




export default router;