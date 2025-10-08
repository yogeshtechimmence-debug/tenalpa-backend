// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     user_image: { type: String, default: "" }, // image file path
//     full_name: { type: String, required: true },
//     business_name: { type: String, required: true },
//     abn_number: { type: String, required: true },
//     email_address: { type: String, required: true, unique: true },
//     contact: { type: Number, required: true },
//     address: { type: String, required: true },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_image: { 
    type: String,
    default: "" 
  },
  full_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  business_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  abn_number: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  email_address: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  contact: { 
    type: String, 
    required: true,
    trim: true 
  },
  address: { 
    type: String, 
    required: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  confirm_password: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

export default mongoose.model("User", userSchema);