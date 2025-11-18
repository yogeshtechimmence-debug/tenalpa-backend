import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    request_id: { type: Number },
    quote_id: { type: Number },
    user_id: { type: Number },
    vendor_id: { type: Number },
    service_id: { type: Number },
    service_price: { type: String },
    serviece_type: { type: String },
    quote_amount: { type: String },
    job_category: { type: String },
    job_title: { type: String },
    schedule: { type: String },
    location: { type: String },
    Date: { type: String },
    time: { type: String },
    notes: { type: String },
    message: { type: String },

    // User Info
    user_name: { type: String },
    full_name: { type: String },
    user_mobile: { type: String },
    user_image: { type: String },

    // Vendor Info
    vendor_name: { type: String },
    vendor_email: { type: String },
    vendor_phone: { type: String },
    vendor_address: { type: String },
    vendor_image: { type: String },
    vendor_rating: { type: Number },

    // Images (job-related)
    images: { type: [String], default: [] },

    // Status fields
    status: {
      type: String,
      enum: ["Pending", "Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Pending",
    },

    // Cancel details
    canceled_at: { type: String, default: "" },
    canceled_time: { type: String, default: "" },
    cancel_reason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
