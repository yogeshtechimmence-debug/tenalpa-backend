// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     user_image: {
//       type: String,
//       default: "",
//     },
//     full_name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
    
//     business_name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     abn_number: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     email_address: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     contact: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     lat: { type: Number, default: 0 }, // latitude
//     lon: { type: Number, default: 0 }, // longitude

//     // 🔹 Added type field (User / Vendor)
//     type: {
//       type: String,
//       enum: ["user", "vendor"],
//       default: "user",
//     },

//     password: {
//       type: String,
//       required: true,
//     },
//     confirm_password: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // 🔹 Custom incremental ID
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    abn_number: { type: String, required: true },
    business_name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
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
    exp_date: { type: String, default: "" },
    date_time: { type: String, default: new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
