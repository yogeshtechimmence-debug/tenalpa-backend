import User from "../../Model/CommonModel/UserAuthModel.js";
import JobPost from "../../Model/UserModel/JobPostModel.js";
import UserBooking from "../../Model/UserModel/UserBookingModel.js";
import Quote from "../../Model/VendorModel/SendQuotModel.js";
import VendorBooking from "../../Model/VendorModel/VendorBookingModel.js";


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

    const userData = await User.findOne({ id: Number(quoteData.user_id) });

    // Auto-increment booking id
    const lastBooking = await UserBooking.findOne().sort({ id: -1 });
    const newId = lastBooking ? lastBooking.id + 1 : 1;

    const Booking = await VendorBooking.findOne().sort({ id: -1 });
    const vendorBookId = lastBooking ? Booking.id + 1 : 1;

    // Create booking from quote data
    const newBooking = new UserBooking({
      id: newId,
      request_id: vendorBookId,
      quote_id: quoteData.id,
      user_id: quoteData.user_id,
      job_id: quoteData.job_id,
      vendor_id: quoteData.vendor_id,
      quote_amount: quoteData.quote_amount,
      job_category: quoteData.job_category,
      job_title: quoteData.job_title,
      message: quoteData.message,
      time: quoteData.time,
      date: quoteData.date,
      image: quoteData.image,
      vendor_name: quoteData.vendor_name,
      vendor_phone: quoteData.vendor_phone,
      vendor_email: quoteData.vendor_email,
      vendor_image: quoteData.vendor_image,
      vendor_address: quoteData.vendor_address,
      vendor_rating: quoteData.vendor_rating,
      status: "Upcoming",
    });

    const VendorData = new VendorBooking({
      id: vendorBookId,
      request_id: vendorBookId,
      vendor_id: quoteData.vendor_id,
      user_id: quoteData.user_id,
      user_image: userData.image,
      job_category: quoteData.job_category,
      job_title: quoteData.job_title,
      quote_amount: quoteData.quote_amount,
      user_name: `${userData.first_name} ${userData.last_name}`,
      schedule: `${quoteData.date} ${quoteData.time}`,
      status: "Upcoming",
    });

    await newBooking.save();
    await VendorData.save();
    console.log(newBooking, "------------------user");
    console.log(VendorData, "------------------vendor");

    await Quote.deleteOne({ id: Number(quote_id) });
    await JobPost.deleteOne({ id: Number(quoteData.job_id) });

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
