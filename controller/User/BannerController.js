import Banner from "../../Model/UserModel/BannerModel.js";

// export const createBanner = async (req, res) => {
//   try {
//     const { name, link } = req.body;
//     const image = req.file
//       ? `https://tenalpa-backend.onrender.com/uploads/UserImage/bannerImage/${req.file.filename}`
//       : "";

//     if (!name || !link) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Find last job ID safely
//     const lastJob = await Banner.findOne().sort({ id: -1 });
//     const newId = lastJob ? lastJob.id + 1 : 1;

//     const banner = new Banner({
//       id: newId,
//       name,
//       link,
//       image,
//     });
//     await banner.save();

//     res.status(201).json({
//       status: "1",
//       message: "Banner created successfully",
//       banner,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "0",
//       message: "Error creating banner",
//       error: error.message,
//     });
//   }
// };

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
