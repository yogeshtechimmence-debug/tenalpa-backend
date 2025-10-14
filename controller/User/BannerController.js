import Banner from "../../Model/UserModel/BannerModel.js";

export const createBanner = async (req, res) => {
  try {
    const { name, description, userId } = req.query;
    const image = req.file
      ? `https://tenalpa-backend.onrender.com/uploads/UserImage/bannerImage/${req.file.filename}`
      : "";

    if (!name || !image || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const banner = new Banner({ name, image, description, userId });
    await banner.save();

    res.status(201).json({
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating banner",
      error: error.message,
    });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Banner fetch successfully",
      banners,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching banners",
      error: error.message,
    });
  }
};
