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
    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (page - 1) * limit;

    // Search filter (by name or id)
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { id: Number(search) || 0 }, // if numeric id search
          ],
        }
      : {};

    // Total count for pagination
    const totalCount = await SubCategory.countDocuments(filter);

    // Get paginated data
    const categories = await SubCategory.find(filter)
      .sort({ id: 1 })
      .skip(skip)
      .limit(Number(limit));

    if (!categories.length) {
      return res.status(404).json({
        status: 0,
        message: "No subcategories found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Subcategories fetched successfully",
      result: categories,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while fetching subcategories",
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
