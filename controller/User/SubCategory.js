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

    // ✅ Check if Category exists
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

// ✅ Get all items for a specific category_id
export const GetSubCategory = async (req, res) => {
  try {
    const { category_id } = req.query;

    const items = await SubCategory.find({ category_id });

    res.status(200).json({
      status: 1,
      message: "Items fetched successfully",
      result: items,
    });
  } catch (error) {
    console.error("Error fetching category items:", error);
    res.status(500).json({
      status: 0,
      message: "Server error while fetching items",
      error: error.message,
    });
  }
};
