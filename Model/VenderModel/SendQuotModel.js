import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    user_id: { type: Number },
    job_id: { type: Number },
    vendor_id: { type: Number },
    quote_amount: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, required: true },
    image: [{ type: String }],
    vendor_name: { type: String },
    vendor_phone: { type: String },
    vendor_email: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quote", QuoteSchema);
