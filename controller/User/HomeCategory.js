import Category from "../../Model/UserModel/HomeCategoryModel.js";

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories (oldest first → ascending order)
    const categories = await Category.find().sort({ id: 1 });

    // If no data found
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: 0,
        message: "No categories found",
      });
    }

    // Success response
    res.status(200).json({
      status: 1,
      message: "Categories fetched successfully",
      result: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while fetching categories",
      error: error.message,
    });
  }
};
