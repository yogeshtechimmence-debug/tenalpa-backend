import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    abn_number: { type: String },
    business_name: { type: String },
    
    // Vendor specific fields
    service_offered: { type: String },
    previous_job: [{ type: String }],
    availability: { type: String },
    emergency: { type: String },
    charges: { type: String },
    enter_hour_rate: { type: String },
    rating: { type: Number, default: 0 },
    
    // Common fields
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
    
    // Type field - now includes VENDOR
    type: {
      type: String,
      enum: ["USER", "VENDOR"],
      required: true,
    },
    
    lat: { type: String, default: "0.0" },
    lon: { type: String, default: "0.0" },
    address: { type: String, required: true, trim: true },
    register_id: { type: String, default: "" },
    ios_register_id: { type: String, default: "" },
    status: { type: String, default: "Active" },
    date_time: { type: String, default: new Date().toISOString() },
    fcm_token: { type: String },
    
    // OTP fields
    otpHash: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("authUser", userSchema);