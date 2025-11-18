import User from "../../Model/CommonModel/UserAuthModel.js";
import JobPost from "../../Model/UserModel/JobPostModel.js";
import Quote from "../../Model/VendorModel/SendQuotModel.js";
import Booking from "../../Model/CommonModel/Booking.js";

export const quoteBooking = async (req, res) => {
  try {
    const { quote_id, user_id } = req.query;

    if (!quote_id) {
      return res.status(400).json({
        success: false,
        message: "quote_id is required",
      });
    }
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    // Find quote details
    const quoteData = await Quote.findOne({
      id: Number(quote_id),
      user_id: Number(user_id),
    });

    if (!quoteData) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Fetch user
    const userData = await User.findOne({ id: Number(quoteData.user_id) });

    // Auto increment booking id
    const lastBooking = await Booking.findOne().sort({ id: -1 });
    const newBookingId = lastBooking ? lastBooking.id + 1 : 1;

    const BookingData = new Booking({
      id: newBookingId,
      quote_id: quoteData.id,
      user_id: quoteData.user_id,
      vendor_id: quoteData.vendor_id,
      job_id: quoteData.job_id,
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
      user_image: userData.image,
      user_name: `${userData.first_name} ${userData.last_name}`,
      user_mobile: userData.mobile,
      schedule: `${quoteData.date} ${quoteData.time}`,
      status: "Upcoming",
    });

    // console.log(BookingData, "------->>>>>>>>>>>>>");
    await BookingData.save();

    await Quote.deleteOne({ id: Number(quote_id), user_id: Number(user_id) });
    await JobPost.deleteOne({
      id: Number(quoteData.job_id),
      user_id: Number(quoteData.user_id),
    });

    res.status(200).json({
      success: true,
      message: "Quote accepted and booking created successfully",
      result: BookingData,
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
