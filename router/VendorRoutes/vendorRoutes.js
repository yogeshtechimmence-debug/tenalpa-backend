import express from "express"
import createMulter from "../../middleware/upload.js";
import { getAllJobs, SendQuote } from "../../controller/Vendor/SendQuotController.js";
import { AddServices, DeleteServices, GetServicesByvendor, UpdateServices } from "../../controller/Vendor/AddServicesController.js";
import { DeleteRequest, getVendorRequests } from "../../controller/Vendor/RequestController.js";
import { AcceptBooking, CancelBooking, ComplateBooking, getBookings, getTodayBooking, MarkStart } from "../../controller/Vendor/VendorBooking.js";
import { downloadInvoicePDF, getInvoice } from "../../controller/Vendor/inVoice.js";

const router = express.Router();

// ----------------------- Vender services Routes -------------------------------------------

const ServicesUpload = createMulter("VendorImage", "servicesImage");

router.post("/add_services", ServicesUpload.array("image", 10), AddServices);
router.get("/get_services", GetServicesByvendor);
router.put("/update_services", ServicesUpload.array("image", 10), UpdateServices);
router.delete("/delete_services", DeleteServices);

// ---------------- Quot Route -----------------------

const QuotImage = createMulter("UserImage", "QuotImage");
router.post("/send_quote",  QuotImage.array("image", 5) ,SendQuote);
router.get("/get_all_job", getAllJobs);


// ---------------- Send Route  -----------------------


router.get("/get_vendor_request", getVendorRequests);
router.delete("/delete_request", DeleteRequest);



// ---------------- Invoice Route -----------------------

router.get("/get_invoice", getInvoice)

router.get("/download-invoice", downloadInvoicePDF);


// ---------------- Send Route  -----------------------

router.post("/accept_booking", AcceptBooking);
router.get("/get_booking", getBookings);
router.post("/mark_start", MarkStart);
router.post("/complate_booking", ComplateBooking);
router.get("/get_today_booking", getTodayBooking);
router.post("/cancel_booking", CancelBooking);




export default router;