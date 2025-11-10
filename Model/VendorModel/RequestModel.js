import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    request_id: { type: Number },
    user_id: { type: Number },
    vendor_id: { type: Number },
    user_image: { type: String },
    full_name: { type: String },
    user_mobile: { type: String },
    serviece_id: { type: Number },
    serviece_price: { type: String },
    serviece_type: { type: String },
    location: { type: String },
    Date: { type: String },
    time: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum : ["Pending", "Upcoming", "Ongoing", "Complate"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("request", RequestSchema);
