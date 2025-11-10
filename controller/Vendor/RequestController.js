import Request from "../../Model/VendorModel/RequestModel.js";
import User from "../../Model/CommonModel/UserAuthModel.js";
import Services from "../../Model/VendorModel/AddServicesModel.js";
import UserBooking from "../../Model/UserModel/UserBookingModel.js";

//  New Request Controller
export const SendRequest = async (req, res) => {
  try {
    const { 
      user_id, 
      serviece_id, 
      serviece_type, 
      location, 
      Date, 
      time, 
      notes 
    } = req.query; 

    // Required fields
    if (!user_id || !serviece_id || !Date || !time || !location) {
      return res.status(400).json({
        success: false,
        message: "user_id, serviece_id, date, time, location are required",
      });
    }

    // Check User
    const userData = await User.findOne({ id: user_id });
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check Service
    const servicesData = await Services.findOne({ id: serviece_id });
    if (!servicesData) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Check Vendor
    const VendorData = await User.findOne({ id: servicesData.user_id });
    if (!VendorData) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }


    // Auto-Increment Request ID
    const lastRequest = await Request.findOne().sort({ id: -1 });
    const newId = lastRequest ? lastRequest.id + 1 : 1;

    // Create Request Entry
    const newRequest = new Request({
      id: newId,
      request_id: newId,
      user_id,
      vendor_id: servicesData.user_id,
      serviece_id: servicesData.id,
      user_image: userData.image || "",
      serviece_price: servicesData.servies_price,
      serviece_type,
      location,
      Date,
      time,
      notes,
      full_name: `${userData.first_name} ${userData.last_name}`,
      user_mobile: userData.mobile,
      status: "Pending",
    });

    // Auto-Increment Booking ID
    const lastBooking = await UserBooking.findOne().sort({ id: -1 });
    const newBookingId = lastBooking ? lastBooking.id + 1 : 1;

    // Create Booking
    const userBooking = new UserBooking({
      id: newBookingId,
      request_id: newId,
      user_id,
      vendor_id: servicesData.user_id,
      service_id: servicesData.id,
      vendor_name: `${VendorData.first_name} ${VendorData.last_name}`,
      vendor_image: VendorData.image,
      serviece_price: servicesData.servies_price,
      serviece_type,
      // schedule_date: Date,
      // schedule_time: time,
      schedule: `${Date} ${time}`,
      location,
      status: "Pending",
    });

    await userBooking.save();
    await newRequest.save();

    console.log(userBooking,"------------------user")
    console.log(newRequest,"------------------vendor")


    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: newRequest,
    });

  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all requests for a USER
export const getUserRequests = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    // Find all requests created by the user
    const requests = await Request.find({ user_id: Number(user_id) }).sort({
      id: 1,
    });

    if (!requests.length) {
      return res.status(404).json({
        success: false,
        message: "No requests found for this user",
      });
    }

    // Only send limited fields to user
    const userRequests = requests.map((req) => ({
      id: req.id,
      user_id: req.user_id,
      serviece_type: req.serviece_type,
      serviece_price: req.serviece_price,
      location: req.location,
      Date: req.Date,
      time: req.time,
      notes: req.notes,
      status: req.status,
    }));

    res.status(200).json({
      success: true,
      message: "User requests fetched successfully",
      total_requests: userRequests.length,
      result: userRequests,
    });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user requests",
      error: error.message,
    });
  }
};

// Get all requests for a VENDOR
export const getVendorRequests = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    // Find all requests for this vendor
    const requests = await Request.find({ vendor_id: Number(user_id) }).sort({
      id: 1,
    });

    if (!requests.length) {
      return res.status(404).json({
        success: false,
        message: "No requests found for this vendor",
      });
    }

    // Show vendor-side relevant fields
    const vendorRequests = requests.map((req) => ({
      id: req.id,
      vendor_id: req.vendor_id,
      serviece_id: req.serviece_id,
      serviece_type: req.serviece_type,
      serviece_price: req.serviece_price,
      location: req.location,
      Date: req.Date,
      time: req.time,
      notes: req.notes,
      full_name: req.full_name,
      user_mobile: req.user_mobile,
      user_image: req.user_image,
    }));

    res.status(200).json({
      success: true,
      message: "Vendor requests fetched successfully",
      total_requests: vendorRequests.length,
      result: vendorRequests,
    });
  } catch (error) {
    console.error("Error fetching vendor requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching vendor requests",
      error: error.message,
    });
  }
};

// DELETE REQUEST By id
export const DeleteRequest = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Request id is required",
      });
    }

    // Find and delete Request by numeric id
    const deletedRequest = await Request.findOneAndDelete({ id: id });

    if (!deletedRequest) {
      return res.status(404).json({
        status: 0,
        message: "Request not found with this id",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Request deleted successfully",
      result: deletedRequest,
    });
  } catch (error) {
    console.error("Error deleting Request:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while deleting Request",
      error: error.message,
    });
  }
};
