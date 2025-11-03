import Request from "../../Model/VenderModel/RequestModel.js";
import VendorBooking from "../../Model/VenderModel/VenderBookingModel.js";
import User from "../../Model/CommonModel/UserAuthModel.js";
import UserNotification from "../../Model/UserModel/UserNotification.js";
import { sendNotification } from "../SendNotification.js";

// Accept Request Controller
// export const AcceptBooking = async (req, res) => {
//   try {
//     const { request_id } = req.query;

//     if (!request_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Request ID is required",
//       });
//     }

//     // Find the request by ID
//     const requestData = await Request.findOne({ id: Number(request_id) });

//     if (!requestData) {
//       return res.status(404).json({
//         success: false,
//         message: "Request not found",
//       });
//     }

//     //  Update request status to ACCEPTED
//     requestData.status = "ACCEPTED";
//     await requestData.save();

//     const VendorData = await User.findOne({
//       id: Number(requestData.vendor_id),
//     });
//     // console.log(VendorData);

//     const notification = await UserNotification.findOne().sort({ id: -1 });
//     const notificationId = notification ? notification.id + 1 : 1;

//     const newNotification = new UserNotification({
//       id: notificationId,
//       user_id: requestData.user_id,
//       vendor_id: VendorData.id,
//       notification_title: "Your service booking is confirmed!",
//       notification_discription: "We’ve notified the Vendor. They’ll reach out soon.",
//       serviece_id: requestData.serviece_id,
//       serviece_type: requestData.serviece_type,
//       location: requestData.location,
//       Date: requestData.Date,
//       time: requestData.time,
//       vendor_mobile: VendorData.mobile,
//       vendor_name: `${VendorData.first_name} ${VendorData.last_name}`,
//       vendor_image: VendorData.image,
//     });

//     // console.log(newNotification,"----------------->>>>>>>>>>>>>>>")
//     await newNotification.save();

//     //  Also create a booking entry
//     const lastBooking = await VendorBooking.findOne().sort({ id: -1 });
//     const newId = lastBooking ? lastBooking.id + 1 : 1;

//     const newBooking = new VendorBooking({
//       id: newId,
//       user_id: requestData.user_id,
//       vendor_id: requestData.vendor_id,
//       serviece_id: requestData.serviece_id,
//       serviece_type: requestData.serviece_type,
//       user_image: requestData.user_image,
//       location: requestData.location,
//       Date: requestData.Date,
//       time: requestData.time,
//       notes: requestData.notes,
//       full_name: requestData.full_name,
//       user_mobile: requestData.user_mobile,
//       status: "Accepted",
//     });

//     await newBooking.save();

//     res.status(200).json({
//       success: true,
//       message: "Request accepted successfully and booking created",
//       // updated_request: requestData,
//       result: newBooking,
//     });
//   } catch (error) {
//     console.error("Error accepting request:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while accepting request",
//       error: error.message,
//     });
//   }
// };
export const AcceptBooking = async (req, res) => {
  try {
    const { request_id } = req.query;

    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    //  Find the request by ID
    const requestData = await Request.findOne({ id: Number(request_id) });

    if (!requestData) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    //  Update request status to ACCEPTED
    requestData.status = "ACCEPTED";
    await requestData.save();

    //  Find vendor data
    const VendorData = await User.findOne({
      id: Number(requestData.vendor_id),
    });

    //  Create new notification
    const notification = await UserNotification.findOne().sort({ id: -1 });
    const notificationId = notification ? notification.id + 1 : 1;

    const newNotification = new UserNotification({
      id: notificationId,
      user_id: requestData.user_id,
      vendor_id: VendorData.id,
      notification_title: "Your service booking is confirmed!",
      notification_discription:
        "We’ve notified the Vendor. They’ll reach out soon.",
      serviece_id: requestData.serviece_id,
      serviece_type: requestData.serviece_type,
      location: requestData.location,
      Date: requestData.Date,
      time: requestData.time,
      vendor_mobile: VendorData.mobile,
      vendor_name: `${VendorData.first_name} ${VendorData.last_name}`,
      vendor_image: VendorData.image,
    });

    await newNotification.save();

    //  Create booking entry
    const lastBooking = await VendorBooking.findOne().sort({ id: -1 });
    const newId = lastBooking ? lastBooking.id + 1 : 1;

    const newBooking = new VendorBooking({
      id: newId,
      user_id: requestData.user_id,
      vendor_id: requestData.vendor_id,
      serviece_id: requestData.serviece_id,
      serviece_type: requestData.serviece_type,
      user_image: requestData.user_image,
      location: requestData.location,
      Date: requestData.Date,
      time: requestData.time,
      notes: requestData.notes,
      full_name: requestData.full_name,
      user_mobile: requestData.user_mobile,
      status: "Accepted",
    });

    await newBooking.save();

    //  Find the user to send push notification
    const userData = await User.findOne({ id: Number(requestData.user_id) });

    if (userData) {
      //  Send push notification to iPhone (via FCM)
      await sendNotification(userData, {
        title: "Your service booking is confirmed!",
        message: "We’ve notified the Vendor. They’ll reach out soon.",
        type: "BOOKING_CONFIRMATION",
        data: {
          booking_id: String(newBooking.id),
          vendor_name: `${VendorData.first_name} ${VendorData.last_name}`,
          type: "BOOKING_CONFIRMATION",
        },
      });
    }

    // Response
    res.status(200).json({
      success: true,
      message: "Request accepted successfully and booking created",
      result: newBooking,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while accepting request",
      error: error.message,
    });
  }
};

// Get All Bookings by user_id
export const getBookings = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }
    // Find all bookings by user_id (ascending order)
    const bookings = await VendorBooking.find({
      user_id: Number(user_id),
    }).sort({
      id: 1,
    });

    if (!bookings.length) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user",
      });
    }

    res.status(200).json({
      message: "Booking get successfully",
      success: true,
      total_bookings: bookings.length,
      result: bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
      error: error.message,
    });
  }
};

// Cancel Booking by id
export const CancelBooking = async (req, res) => {
  try {
    const { id, reason } = req.body; // reason in body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Booking id is required",
      });
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Cancel reason is required",
      });
    }

    // Find booking
    const booking = await VendorBooking.findOne({ id: Number(id) });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found with this id",
      });
    }

    // Get current date & time
    const now = new Date(); // DD/MM/YYYY
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Update cancel info
    booking.status = "Canceled";
    booking.canceled_at = date;
    booking.canceled_time = time;
    booking.cancel_reason = reason;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking canceled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({
      success: false,
      message: "Server error while canceling booking",
      error: error.message,
    });
  }
};

export const deleteAllVendorBookings = async (req, res) => {
  try {
    await VendorBooking.deleteMany({}); // sab documents delete ho jayenge
    res.status(200).json({
      success: true,
      message: "All VendorBooking data deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting VendorBooking data",
      error: error.message,
    });
  }
};
