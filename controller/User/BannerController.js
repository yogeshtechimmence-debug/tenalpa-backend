import Banner from "../../Model/UserModel/BannerModel.js";

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
