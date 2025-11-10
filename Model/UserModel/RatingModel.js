import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    user_id: { typee : String },
    vendor_id: { type: Number, },
    Service_id: { type: Number, required: true },
    vendor_image: { type: String },
    vendor_name: { type: String },
    vendor_rating: { type: Number },
    rating: { type: Number },
    review: { type: String, required: true },
    image: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("rating", RatingSchema);
