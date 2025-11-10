import User from "../../Model/CommonModel/UserAuthModel.js";
import Services from "../../Model/VendorModel/AddServicesModel.js";


export const FilterService = async (req, res) => {
  try {
    const { Service_type, location, lat, lon, rating } = req.query;

    if (!Service_type) {
      return res.status(400).json({ success: false, message: "Service_type is required" });
    }
    const serviceData = await Services.find({
      $or: [
        { services_category: Service_type },
      ],
    });
    if (serviceData.length === 0) {
      return res.status(404).json({ success: false, message: "No services found" });
    }
    const userIds = serviceData.map((s) => s.user_id);
    const users = await User.find({ id: { $in: userIds } }).select("id rating name");

    let finalData = serviceData.map((service) => {
      const user = users.find((u) => u.id.toString() === service.user_id.toString());
      return {
        ...service.toObject(),
        user_rating: user ? user.rating : null,
      };
    });
    if (rating) {
      const minRating = parseFloat(rating);
      finalData = finalData.filter((s) => s.user_rating && s.user_rating >= minRating);
    }
    finalData.sort((a, b) => (b.user_rating || 0) - (a.user_rating || 0));

    res.status(200).json({
      success: true,
      message: "Filtered service data fetched successfully",
      total: finalData.length,
      result: finalData,
    });
  } catch (error) {
    console.error("Error in FilterService:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
