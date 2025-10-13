import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // 🔹 Custom incremental ID
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    abn_number: { type: String, required: true },
    business_name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    mobile_with_code: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    type: {
      type: String,
      enum: ["USER", "VENDOR"],
      default: "USER",
    },
    lat: { type: String, default: "0.0" },
    lon: { type: String, default: "0.0" },
    address: { type: String, required: true, trim: true },
    register_id: { type: String, default: "" },
    ios_register_id: { type: String, default: "" },
    status: { type: String, default: "Active" },
    date_time: { type: String, default: new Date().toISOString() },
    // OTP fields
    otpHash: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
