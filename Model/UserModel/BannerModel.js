import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    userId: {
      type: String,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    complate_image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
