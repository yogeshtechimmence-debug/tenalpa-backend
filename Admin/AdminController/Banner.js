import Banner from "../../Model/UserModel/BannerModel.js";

//ADD Banner
export const createBanner = async (req, res) => {
  try {
    const { name, link } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/UserImage/bannerImage/${req.file.filename}`
      : "";

    if (!name || !link) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find last job ID safely
    const lastJob = await Banner.findOne().sort({ id: -1 });
    const newId = lastJob ? lastJob.id + 1 : 1;

    const banner = new Banner({
      id: newId,
      name,
      link,
      image,
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

// DELETE Banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ status: 0, message: "Banner ID is required" });
    }

    const banner = await Banner.findOneAndDelete({ id: id });

    if (!banner) {
      return res.status(404).json({ status: 0, message: "Banner not found" });
    }

    return res
      .status(200)
      .json({ status: 1, message: "Banner deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSingleBanner = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Banner ID is required",
      });
    }

    const banner = await Banner.findOne({ id: id });

    if (!banner) {
      return res.status(404).json({
        status: 0,
        message: "Banner not found",
      });
    }

    return res.status(200).json({
      status: 1,
      banner,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE Banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, link } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: 0, message: "Banner ID is required" });
    }

    // Find banner by custom ID
    const banner = await Banner.findOne({ id: id });

    if (!banner) {
      return res.status(404).json({ status: 0, message: "Banner not found" });
    }

    // If new image uploaded → update
    let image = banner.image;
    if (req.file) {
      image = `https://tenalpa-backend.onrender.com/uploads/UserImage/bannerImage/${req.file.filename}`;
    }

    // Update fields
    banner.name = name || banner.name;
    banner.link = link || banner.link;
    banner.image = image;

    await banner.save();

    return res.status(200).json({
      status: 1,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
      error: error.message,
    });
  }
};
