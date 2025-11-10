import mongoose from "mongoose";
import Banner from "../../Model/UserModel/BannerModel.js";
import dotenv from "dotenv";
import UserAuthModel from "../../Model/CommonModel/UserAuthModel.js";

export const createBanner = async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const image = req.files["image"]
      ? `https://tenalpa-backend.onrender.com/uploads/UserImage/bannerImage/${req.files["image"][0].filename}`
      : "";

    const complate_image = req.files["complate_image"]
      ? `https://tenalpa-backend.onrender.com/uploads/UserImage/bannerImage/${req.files["complate_image"][0].filename}`
      : "";

    if (!name || !image || !complate_image || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find last job ID safely
    const lastJob = await Banner.findOne().sort({ id: -1 });
    const newId = lastJob ? lastJob.id + 1 : 1;

    const banner = new Banner({
      id: newId,
      name,
      image,
      complate_image,
      description,
      userId,
    });
    await banner.save();

    res.status(201).json({
      status: "1",
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      status: "0",
      message: "Error creating banner",
      error: error.message,
    });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ id: 1 });
    res.status(200).json({
      status: "1",
      message: "Banner fetch successfully",
      result: banners,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching banners",
      error: error.message,
    });
  }
};

// dotenv.config();

// const AddRating = async () => {
//   try {
//     // MongoDB connection
//     await mongoose.connect(
//       "mongodb+srv://yogeshtechimmence_db_user:sEYrq7ThZfcX10Mm@cluster0.zp2oqeb.mongodb.net/Tenalpa?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     console.log("✅ Connected to MongoDB");

//     // Sirf un documents ko update karo jisme rating field nahi hai
//     const result = await UserAuthModel.updateMany(
//       { rating: { $exists: false } },
//       {
//         $set: {
//           rating: 0, // default value 0
//         },
//       }
//     );

//     console.log(`✅ Successfully updated ${result.modifiedCount} users`);
//     console.log("🎉 Rating field added successfully to all users");
//   } catch (error) {
//     console.error("❌ Migration failed:", error);
//   } finally {
//     await mongoose.connection.close();
//     process.exit(0);
//   }
// };

// AddRating();
