import mongoose from "mongoose";

const MyBookingSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    request_id: { type: Number },
    user_id: { type: Number },
    vendor_id: { type: Number },
    serviece_id: { type: Number },
    serviece_price: { type: String },
    user_image: { type: String },
    job_category: { type: String },
    job_title: { type: String },
    quote_amount: { type: String },
    user_name: { type: String },
    serviece_type: { type: String },
    location: { type: String },
    Date: { type: String },
    time: { type: String },
    notes: { type: String },
    full_name: { type: String },
    user_mobile: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Upcoming", "Ongoing", "Complate", "Canceled"],
    },
    canceled_at: { type: String, default: "" },
    canceled_time: { type: String, default: "" },
    cancel_reason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("VenderBooking", MyBookingSchema);
