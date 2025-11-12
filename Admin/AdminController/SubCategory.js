import SubCategory from "../../Model/UserModel/SubCategoryModel.js";
import Category from "../../Model/UserModel/HomeCategoryModel.js";

export const AddSubCategory = async (req, res) => {
  try {
    const { category_id, name } = req.body;
    const image = req.file
      ? `https://tenalpa-backend.onrender.com/uploads/UserImage/subCategory/${req.file.filename}`
      : "";

    // Check required fields
    if (!category_id || !name || !image) {
      return res.status(400).json({
        status: 0,
        message: "category_id, name, and image are required",
      });
    }

    //  Check if Category exists
    const categoryExists = await Category.findOne({ id: category_id });
    if (!categoryExists) {
      return res.status(404).json({
        status: 0,
        message: "Category not found. Please provide a valid category_id.",
      });
    }

    // Find last SubCategory safely
    const lastSubCategory = await SubCategory.findOne().sort({ id: -1 });
    const newId = lastSubCategory ? lastSubCategory.id + 1 : 1;

    const newItem = new SubCategory({
      id: newId,
      category_id,
      name,
      image,
    });

    await newItem.save();

    res.status(201).json({
      status: 1,
      message: "SubCategory created successfully",
      result: newItem,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while creating subcategory",
      error: error.message,
    });
  }
};

// GET ALL CATEGORIES
export const AllSubCategories = async (req, res) => {
  try {
    // Fetch all categories (oldest first → ascending order)
    const categories = await SubCategory.find().sort({ id: 1 });

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
export const deleteSubCategory = async (req, res) => {
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
    const deletedCategory = await SubCategory.findOneAndDelete({ id: Number(id) });

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
export const getSingleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "Category ID is required",
      });
    }

    const category = await SubCategory.findOne({ id: Number(id) });

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
export const updateSubCategory = async (req, res) => {
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

    const updatedCategory = await SubCategory.findOneAndUpdate(
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
