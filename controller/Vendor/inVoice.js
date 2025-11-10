import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import inVoice from "../../Model/VendorModel/inVoiceModel.js";
import VendorBooking from "../../Model/VendorModel/VendorBookingModel.js";
import Services from "../../Model/VendorModel/AddServicesModel.js";
import User from "../../Model/CommonModel/UserAuthModel.js";

export const getInvoice = async (req, res) => {
  try {
    const { book_id } = req.query;

    if (!book_id) {
      return res
        .status(400)
        .json({ status: "0", message: "book_id is required" });
    }

    const vendorBooking = await VendorBooking.findOne({ id: Number(book_id) });
    if (!vendorBooking) {
      return res
        .status(404)
        .json({ status: "0", message: "Booking not found" });
    }

    const serviceData = await Services.findOne({
      id: Number(vendorBooking.serviece_id),
    });
    if (!serviceData) {
      return res
        .status(404)
        .json({ status: "0", message: "Service not found" });
    }

    const VenderData = await User.findOne({
      id: Number(vendorBooking.vendor_id),
    });
    if (!VenderData) {
      return res.status(404).json({ status: "0", message: "Vendor not found" });
    }

    const lastJob = await inVoice.findOne().sort({ id: -1 });
    const newId = lastJob ? lastJob.id + 1 : 1;

    const paddedId = String(newId).padStart(4, "0");

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const inv_id = `INV-${currentDate}-${paddedId}`;

    const inVoiceData = new inVoice({
      id: newId,
      inv_id,
      date: vendorBooking.Date, // ensure field name matches model
      status: "Paid",
      name: vendorBooking.full_name,
      phone: vendorBooking.user_mobile,
      service: serviceData.services_category,
      category: serviceData.sub_category,
      vendor: `${VenderData.first_name} ${VenderData.last_name}`,
      service_date: vendorBooking.Date,
      payment_mode: "Online",
      service_price: serviceData.servies_price,
    });

    await inVoiceData.save();

    res.status(200).json({
      status: "1",
      message: "Invoice generated successfully",
      result: inVoiceData,
    });
  } catch (error) {
    console.error("Error in getInvoice:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while generating invoice",
      error: error.message,
    });
  }
};

export const downloadInvoicePDF = async (req, res) => {
  try {
    const { inv_id } = req.query;

    if (!inv_id) {
      return res.status(400).json({ status: "0", message: "inv_id is required" });
    }

    const invoice = await inVoice.findOne({ inv_id });
    if (!invoice) {
      return res.status(404).json({ status: "0", message: "Invoice not found" });
    }

    // PDF File Path
    const fileName = `${invoice.inv_id}.pdf`;
    const filePath = path.join("uploads/invoices", fileName);   

    // Make sure directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(20)
      .text("INVOICE", { align: "center" })
      .moveDown();

    // Invoice Info
    doc
      .fontSize(12)
      .text(`Invoice ID: ${invoice.inv_id}`)
      .text(`Date: ${invoice.date}`)
      .text(`Status: ${invoice.status}`)
      .moveDown();

    // Customer Info
    doc
      .fontSize(14)
      .text("Customer Details", { underline: true })
      .fontSize(12)
      .text(`Name: ${invoice.name}`)
      .text(`Phone: ${invoice.phone}`)
      .moveDown();

    // Service Info
    doc
      .fontSize(14)
      .text("Service Details", { underline: true })
      .fontSize(12)
      .text(`Service: ${invoice.service}`)
      .text(`Category: ${invoice.category}`)
      .text(`Vendor: ${invoice.vendor}`)
      .text(`Service Date: ${invoice.service_date}`)
      .moveDown();

    // Payment Info
    doc
      .fontSize(14)
      .text("Payment Info", { underline: true })
      .fontSize(12)
      .text(`Payment Mode: ${invoice.payment_mode}`)
      .text(`Service Price: ₹${invoice.service_price}`)
      .moveDown();

    // Footer
    doc
      .fontSize(10)
      .text("Thank you for your business!", { align: "center" });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, fileName);
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while generating PDF",
      error: error.message,
    });
  }
};