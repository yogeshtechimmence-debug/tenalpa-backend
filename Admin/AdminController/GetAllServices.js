import vendorServices from '../../Model/VendorModel/AddServicesModel.js';

export const getAllServices = async (req, res) => {
  try {
    const allServices = await vendorServices.aggregate([
      {
        $lookup: {
          from: "authusers",        // User ka MongoDB collection ka naam
          localField: "user_id", // vendorServices me jo field hai
          foreignField: "id",    // Users table me jo match karega
          as: "userData"         // merged data isme aayega
        }
      },
      {
        $unwind: "$userData" // array ko object bana deta hai
      }
    ]);

    res.status(200).json({
      status: "1",
      message: "All vendor services with user data fetched successfully",
      result: allServices,
    });

  } catch (error) {
    console.error("Error fetching services:", error);

    res.status(500).json({
      status: "0",
      message: "Server error while fetching vendor services",
      error: error.message,
    });
  }
};
