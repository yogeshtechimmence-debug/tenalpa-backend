import Booking from "../../Model/CommonModel/Booking.js";

// export const getBookings = async (req, res) => {
//   try {
//     const { status, search } = req.query;

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "status is required",
//       });
//     }

//     let filter = { status };

//     if (search) {
//       const regex = new RegExp(search, "i");

//       const isNumber = !isNaN(search);

//       if (isNumber) {
//         filter.id = Number(search);
//       } else {
//         filter.$or = [{ user_name: regex }, { vendor_name: regex }];
//       }
//     }

//     const bookings = await Booking.find(filter).sort({ id: 1 });

//     res.status(200).json({
//       success: true,
//       message: "Bookings fetched successfully",
//       total: bookings.length,
//       result: bookings,
//     });
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching bookings",
//       error: error.message,
//     });
//   }
// };

export const getBookings = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    let filter = { status };

    if (search) {
      const regex = new RegExp(search, "i");
      const isNumber = !isNaN(search);

      if (isNumber) {
        filter.id = Number(search);
      } else {
        filter.$or = [{ user_name: regex }, { vendor_name: regex }];
      }
    }

    // Get bookings based on filter
    const bookings = await Booking.find(filter).sort({ id: 1 });

    // Get total counts for all status types
    const totalPending = await Booking.countDocuments({ status: "Pending" });
    const totalUpcoming = await Booking.countDocuments({ status: "Upcoming" });
    const totalOngoing = await Booking.countDocuments({ status: "Ongoing" });
    const totalCompleted = await Booking.countDocuments({status: "Complate",});
    const totalCancelled = await Booking.countDocuments({status: "Cancelled",});

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      total: bookings.length,
      result: bookings,
      totalPending,
      totalUpcoming,
      totalOngoing,
      totalCompleted,
      totalCancelled,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
      error: error.message,
    });
  }
};

export const getSingleBookings = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    const booking = await Booking.findOne({
      $or: [{ id: Number(id) }, { id: id }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No booking found for this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      result: booking,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
