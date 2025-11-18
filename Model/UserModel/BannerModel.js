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
    },
    image: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
