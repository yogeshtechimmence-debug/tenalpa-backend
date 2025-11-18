import Booking from "../../Model/CommonModel/Booking.js";

// AcceptBooking
export const AcceptRequest = async (req, res) => {
  try {
    const { request_id, user_id } = req.query; // user id me vendor id send kr rha hu ---------

    if (!request_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Both request_id and user_id are required",
      });
    }

    // Check if booking already exists for this request & user
    const existingBooking = await Booking.findOne({
      request_id: Number(request_id),
      vendor_id: Number(user_id),
    });

    if (existingBooking) {
      // Update status to 'Upcoming'
      await Booking.updateOne(
        { request_id: Number(request_id), vendor_id: Number(user_id) },
        { $set: { status: "Upcoming" } }
      );

      return res.status(200).json({
        success: true,
        message: "Booking status updated to Upcoming successfully",
      });
    }

    //  If no existing booking found
    return res.status(404).json({
      success: false,
      message: "No booking found with given request_id and user_id",
    });
  } catch (error) {
    console.error("Error in AcceptRequest:", error);
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
    const { user_id, status } = req.query;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });
    }
    const query = {
      $or: [{ user_id: Number(user_id) }, { vendor_id: Number(user_id) }],
    };
    if (status) {
      query.status = status;
    }
    const bookings = await Booking.find(query).sort({ id: 1 });
    if (!bookings.length) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No bookings found for this user/vendor",
        });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Bookings fetched successfully",
        result: bookings,
      });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching bookings",
        error: error.message,
      });
  }
};

// Mark as Started
export const MarkStart = async (req, res) => {
  try {
    const { book_id } = req.query;

    if (!book_id) {
      return res.status(400).json({
        success: false,
        message: "book_id is required",
      });
    }

    // VendorBooking status update
    const Ongoing_booking = await Booking.updateOne(
      { id: Number(book_id) },
      { $set: { status: "Ongoing" } }
    );

    return res.status(200).json({
      success: true,
      message: "Booking successfully marked as STARTED",
      result: Ongoing_booking,
    });
  } catch (error) {
    console.error("Error marking booking start:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Complate booking
export const ComplateBooking = async (req, res) => {
  try {
    const { book_id } = req.query;

    if (!book_id) {
      return res.status(400).json({
        success: false,
        message: "book_id is required",
      });
    }

    // VendorBooking status update
    const Complate_booking = await Booking.updateOne(
      { id: book_id },
      { $set: { status: "Complate" } }
    );

    return res.status(200).json({
      success: true,
      message: "Booking successfully Complate",
      result: Complate_booking,
    });
  } catch (error) {
    console.error("Error Complate bookings", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Cancel Booking by id
export const CancelBooking = async (req, res) => {
  try {
    const { book_id, reason } = req.query; // reason in body

    if (!book_id) {
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
    const Cancel_booking = await Booking.findOne({ id: Number(book_id) });

    if (!Cancel_booking) {
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
    Cancel_booking.status = "Cancelled";
    Cancel_booking.canceled_time = time;
    Cancel_booking.cancel_reason = reason;

    await Cancel_booking.save();

    res.status(200).json({
      success: true,
      message: "Booking canceled successfully",
      result: Cancel_booking,
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

// today bookngi api
export const getTodayBooking = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    // Get today's start & end time
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayBookings = await Booking.find({
      vendor_id: Number(user_id),
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ id: 1 });

    if (!todayBookings.length) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for today",
      });
    }

    res.status(200).json({
      success: true,
      message: "Today's bookings fetched successfully",
      total: todayBookings.length,
      result: todayBookings,
    });
  } catch (error) {
    console.error("Error fetching today's bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching today's bookings",
      error: error.message,
    });
  }
};
