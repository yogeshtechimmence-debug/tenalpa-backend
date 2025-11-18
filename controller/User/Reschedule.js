import RescheduleModel from "../../Model/UserModel/RescheduleModel.js";
import UserNotification from "../../Model/UserModel/UserNotification.js";
import User from "../../Model/CommonModel/UserAuthModel.js";
import Booking from "../../Model/CommonModel/Booking.js";



export const RescheduleService = async (req, res) => {
  try {
    const { user_id, book_id, date, time, reason } = req.query;

    // Validation
    if (!user_id || !book_id || !date || !time) {
      return res.status(400).json({
        status: "0",
        message: "All fields are required (user_id, book_id, date, time)",
      });
    }

    // Step 1: Get user and booking
    const userData = await User.findOne({ id: Number(user_id) });
    const booking = await Booking.findOne({ id: Number(book_id) });

    if (!booking) {
      return res.status(404).json({
        status: "0",
        message: "Booking not found",
      });
    }

    // Save old date & time BEFORE updating
    const oldDate = booking.Date;
    const oldTime = booking.time;
    const vendorId = booking.vendor_id 

    // Step 2: Update booking
    booking.Date = date;
    booking.time = time;
    await booking.save();

    // Step 3: Create notification
    const lastNotification = await UserNotification.findOne().sort({ id: -1 });
    const notificationId = lastNotification ? lastNotification.id + 1 : 1;

    const newNotification = new UserNotification({
      id: notificationId,
      user_id: userData.id,
      vendor_id: vendorId,
      notification_title: "Request Reschedule",
      notification_discription: `${userData.first_name} ${userData.last_name} wants to reschedule booking to ${date} ${time}`,
     
    });

    await newNotification.save();
    console.log(newNotification)

    // Step 4: Save reschedule info
    const lastReschedule = await RescheduleModel.findOne().sort({ id: -1 });
    const newId = lastReschedule ? lastReschedule.id + 1 : 1;

    const rescheduleEntry = new RescheduleModel({
      id: newId,
      user_id,
      vendor_id: vendorId,
      book_id,
      date,
      time,
      reason,
      old_date: oldDate,
      old_time: oldTime,
    });

    await rescheduleEntry.save();
    console.log(rescheduleEntry)

    res.status(200).json({
      status: "1",
      message: "Your reschedule request has been sent",
      date_time: `New Date & Time: ${date}, ${time}`,
      description:
        "You’ll be notified once your provider accepts or declines this request.",
      result: rescheduleEntry,
    });
  } catch (error) {
    console.error("Error in RescheduleService:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while rescheduling service",
      error: error.message,
    });
  }
};

export const GetReschedule = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required",
      });
    }

    //  Find all rescheduled bookings for this vendor
    const reschedules = await RescheduleModel.find({
      vendor_id: Number(user_id),
    }).sort({ createdAt: -1 });

    if (reschedules.length === 0) {
      return res.status(404).json({
        status: "0",
        message: "No rescheduled data found for this vendor",
      });
    }

    res.status(200).json({
      status: "1",
      message: "Rescheduled bookings fetched successfully",
      result: reschedules,
    });
  } catch (error) {
    console.error("Error fetching rescheduled data:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while fetching rescheduled data",
      error: error.message,
    });
  }
};

export const DeleteReschedule = async (req, res) => {
  try {
    const { id } = req.query;

    // Validation
    if (!id) {
      return res.status(400).json({
        status: "0",
        message: "id is required",
      });
    }

    // Check record exists or not
    const reschedule = await RescheduleModel.findOne({ id: Number(id) });
    if (!reschedule) {
      return res.status(404).json({
        status: "0",
        message: "Reschedule record not found",
      });
    }

    // Delete the record
    await RescheduleModel.deleteOne({ id: Number(id) });

    res.status(200).json({
      status: "1",
      message: "Reschedule record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reschedule record:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while deleting reschedule record",
      error: error.message,
    });
  }
};
