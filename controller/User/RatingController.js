import Rating from "../../Model/UserModel/RatingModel.js";
import User from "../../Model/CommonModel/UserAuthModel.js";
import Services from "../../Model/VendorModel/AddServicesModel.js";

// Add Rating (POST)
export const addRating = async (req, res) => {
  try {
    const {user_id, Service_id, rating: ratingValue, review } = req.query;

    const images = req.files
      ? req.files.map(
          (file) =>
            `https://tenalpa-backend.onrender.com/uploads/VendorImage/ratingImage/${file.filename}`
        )
      : [];

    // Validation
    if ( !user_id || !Service_id || !ratingValue || !review) {
      return res.status(400).json({
        status: "0",
        message: "All fields are required",
      });
    }

    const ServiceData = await Services.findOne({ id: Number(Service_id) });
    if (!ServiceData) {
      return res.status(404).json({ status: "0", message: "Service not found" });
    }

    const VendorData = await User.findOne({ id: Number(ServiceData.user_id) });

    // Auto ID generate
    const lastRating = await Rating.findOne().sort({ id: -1 });
    const newId = lastRating ? lastRating.id + 1 : 1;

    // Save rating
    const newRating = new Rating({
      id: newId,
      user_id,
      vendor_id: ServiceData.user_id,
      Service_id,
      vendor_image: VendorData.image,
      vendor_name: `${VendorData.first_name} ${VendorData.last_name}`,
      vendor_rating: VendorData.rating,
      rating: ratingValue,
      review,
      image: images,
    });

    await newRating.save();

    // Get all ratings of this vendor
    const allRatings = await Rating.find({ vendor_id: ServiceData.user_id });

    const avg = allRatings.length
      ? allRatings.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        allRatings.length
      : Number(ratingValue);

    // Update vendor rating
    await User.findOneAndUpdate(
      { id: ServiceData.user_id, type: "VENDOR" },
      { rating: avg.toFixed(1) },
      { new: true }
    );

    res.status(201).json({
      status: "1",
      message: "Rating added successfully",
      result: newRating,
      average_rating: avg.toFixed(1),
    });

  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};


// Get Ratings by Service ID
export const getRatingsByService = async (req, res) => {
  try {
    const { Service_id } = req.query;

    if (!Service_id) {
      return res.status(400).json({
        status: "0",
        message: "Service_id is required",
      });
    }

    const ratings = await Rating.find({ Service_id }).sort({ createdAt: -1 });

    if (!ratings.length) {
      return res.status(404).json({
        status: "0",
        message: "No ratings found for this service",
      });
    }

    res.status(200).json({
      status: "1",
      message: "Service ratings fetched successfully",
      result: ratings,
    });
  } catch (error) {
    console.error("Error fetching service ratings:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Singlr user Ratings 
export const getRatings = async (req, res) => {
  try {
    const { vendor_id } = req.query;

    if (!vendor_id) {
      return res.status(400).json({
        status: "0",
        message: "vendor_id is required",
      });
    }

    // 🔹 sirf rating field lo
    const vendor = await UserAuthModel.findOne(
      { id: Number(vendor_id) },
    );

    if (!vendor) {
      return res.status(404).json({
        status: "0",
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      status: "1",
      message: "Vendor rating fetched successfully",
      rating: vendor.rating,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

