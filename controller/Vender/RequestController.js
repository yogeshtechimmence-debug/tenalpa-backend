import Request from "../../Model/VenderModel/RequestModel.js";
import User from "../../Model/UserAuthModel.js";
import Services from "../../Model/VenderModel/AddServicesModel.js";

//  New Request Controller
export const SendRequest = async (req, res) => {
  try {
    const { user_id, serviece_id, serviece_type, location, Date, time, notes } =
      req.body;

    //  Check if user_id exists
    let userData = null;
    let servicesData = null;

    if (user_id) {
      userData = await User.findOne({ id: user_id });
      if (!userData) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    if (serviece_id) {
      servicesData = await Services.findOne({ id: serviece_id });
      if (!servicesData) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    //  Generate auto-incrementing request id
    const lastRequest = await Request.findOne().sort({ id: -1 });
    const newId = lastRequest ? lastRequest.id + 1 : 1;

    //  Create new request object
    const newRequest = new Request({
      id: newId,
      user_id,
      user_id: servicesData.user_id, // Vender id
      serviece_id: servicesData.id,
      serviece_type,
      location,
      Date,
      time,
      notes,
      full_name: `${userData?.first_name} ${userData?.last_name}` || "", // User name , Lastname
      user_mobile: userData?.mobile || "", // User mobile number
    });

    //  Save to DB
    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all requests for a particular user
export const getRequests = async (req, res) => {
  try {
    const { user_id } = req.query; // or req.query, depending on route setup

    // Find all requests for that user_id
    const requests = await Request.find({ user_id: Number(user_id) }).sort({
      id: 1,
    });

    if (!requests.length) {
      return res.status(404).json({
        success: false,
        message: "No requests found for this user",
      });
    }

    res.status(200).json({
      success: true,
      total_requests: requests.length,
      result: requests,
    });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ success: false, message: error.message });
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
