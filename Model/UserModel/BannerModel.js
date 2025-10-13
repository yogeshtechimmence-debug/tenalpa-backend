import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
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
