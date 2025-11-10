import mongoose from "mongoose";

const UserBookingSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    request_id: { type: Number },
    quote_id: { type: Number },
    user_id: { type: Number },
    job_id: { type: Number },
    vendor_id: { type: Number },
    service_id: { type: Number },
    schedule: { type: String },
    serviece_type: { type: String },
    serviece_price: { type: String },
    location: { type: String },
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
    vendor_rating: { type: Number },

    // Additional booking status
    status: {
      type: String,
      enum : ["Pending", "Upcoming", "Ongoing", "Complate"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserBooking", UserBookingSchema);
