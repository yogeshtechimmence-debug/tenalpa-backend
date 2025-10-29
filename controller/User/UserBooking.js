import UserBooking from "../../Model/UserModel/UserBookingModel.js";
import Quote from "../../Model/VenderModel/SendQuotModel.js";

export const quoteBooking = async (req, res) => {
  try {
    const { quote_id } = req.query;

    if (!quote_id) {
      return res.status(400).json({
        success: false,
        message: "quote_id is required",
      });
    }

    // Find quote details
    const quoteData = await Quote.findOne({ id: Number(quote_id) });

    if (!quoteData) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Auto-increment booking id
    const lastBooking = await UserBooking.findOne().sort({ id: -1 });
    const newId = lastBooking ? lastBooking.id + 1 : 1;

    // Create booking from quote data
    const newBooking = new UserBooking({
      id: newId,
      quote_id: quoteData.id,
      user_id: quoteData.user_id,
      job_id: quoteData.job_id,
      vendor_id: quoteData.vendor_id,
      quote_amount: quoteData.quote_amount,
      message: quoteData.message,
      time: quoteData.time,
      date: quoteData.date,
      image: quoteData.image,
      vendor_name: quoteData.vendor_name,
      vendor_phone: quoteData.vendor_phone,
      vendor_email: quoteData.vendor_email,
      status: "BOOKED", // default
    });

    await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Quote accepted and booking created successfully",
      result: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Server error while accepting booking",
      error: error.message,
    });
  }
};
