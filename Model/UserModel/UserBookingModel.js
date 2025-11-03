import mongoose from "mongoose";

const UserBookingSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },

    // From Quote
    quote_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    job_id: { type: Number },
    vendor_id: { type: Number },
    quote_amount: { type: String },
    job_category: { type: String },
    job_title: { type: String },
    message: { type: String },
    time: { type: String },
    date: { type: String },
    image: { type: [String] },
    vendor_name: { type: String },
    vendor_phone: { type: String },
    vendor_email: { type: String },
    vendor_image: { type: String },
    vendor_address: { type: String },

    // Additional booking status
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserBooking", UserBookingSchema);
