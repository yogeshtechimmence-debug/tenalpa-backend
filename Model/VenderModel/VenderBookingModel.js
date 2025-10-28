import mongoose from "mongoose";

const MyBookingSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    user_id: { type: Number },
    vendor_id: { type: Number },
    serviece_id: { type: Number },
    serviece_type: { type: String },
    location: { type: String },
    Date: { type: String },
    time: { type: String },
    notes: { type: String },
    full_name: { type: String },
    user_mobile: { type: String },
    status: { type: String, default: "Accepted" },
    canceled_at: { type: String, default: "" },  
    canceled_time: { type: String, default: "" },
     cancel_reason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("VenderBooking", MyBookingSchema);
