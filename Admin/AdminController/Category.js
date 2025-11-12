import Category from '../../Model/UserModel/HomeCategoryModel.js';

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
export const AllCategories = async (req, res) => {
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

// delete category//
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Category ID is required",
      });
    }

    // Find and delete
    const deletedCategory = await Category.findOneAndDelete({ id: Number(id) });

    if (!deletedCategory) {
      return res.status(404).json({
        status: 0,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Category deleted successfully",
      result: deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while deleting category",
      error: error.message,
    });
  }
};


// get single catrogry
export const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Category ID is required",
      });
    }

    const category = await Category.findOne({ id: Number(id) });

    if (!category) {
      return res.status(404).json({
        status: 0,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Category fetched successfully",
      result: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while fetching category",
      error: error.message,
    });
  }
};

// update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const image = req.file
      ? `https://tenalpa-backend.onrender.com/uploads/UserImage/categoryImage/${req.file.filename}`
      : undefined;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Category ID is required",
      });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (image) updatedData.image = image;

    const updatedCategory = await Category.findOneAndUpdate(
      { id: Number(id) },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: 0,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Category updated successfully",
      result: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while updating category",
      error: error.message,
    });
  }
};
