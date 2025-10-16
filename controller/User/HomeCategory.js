import Category from "../../Model/UserModel/HomeCategoryModel.js";


// ADD Category 
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file
      ? `https://tenalpa-backend.onrender.com/uploads/UserImage/categoryImage/${req.file.filename}`
      : "";

    if (!name || !image) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required",
      });
    }

    // Find last category safely
    const lastCategory = await Category.findOne().sort({ id: -1 });
    const newId = lastCategory ? lastCategory.id + 1 : 1;

    const category = new Category({
      id: newId,
      name,
      image,
    });

    await category.save();

    res.status(201).json({
      status: 1,
      message: "Category created successfully",
      result: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while creating category",
      error: error.message,
    });
  }
};


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
