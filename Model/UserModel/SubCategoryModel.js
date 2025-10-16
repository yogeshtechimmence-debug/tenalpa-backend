import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
     id: {
      type: Number,
      required: true,
      unique: true,
    },
    category_id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", SubCategorySchema);
