import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/AuthModel.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      abn_number,
      business_name,
      mobile,
      email,
      password,
      address,
      lat,
      lon,
      type,
      register_id,
      ios_register_id,
      status,
      exp_date,
    } = req.body;

    // Image from multer
    const image = req.file
      ? `/uploads/UserImage/${req.file.filename}`
      : "";

    // Validate fields
    if (
      !first_name ||
      !last_name ||
      !abn_number ||
      !business_name ||
      !mobile ||
      !email ||
      !password ||
      !address
    ) {
      return res.status(400).json({
        status: "0",
        message: "All required fields must be filled",
      });
    }

    //  Check duplicates
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ status: "0", message: "Email already exists" });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json({ status: "0", message: "Mobile already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto Increment ID
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;

    // Create new user
    const newUser = new User({
      id: newId, //  auto-incremented
      first_name,
      last_name,
      abn_number,
      business_name,
      mobile,
      email,
      password: hashedPassword,
      image,
      type:
        type && ["USER", "VENDOR"].includes(type.toUpperCase())
          ? type.toUpperCase()
          : "USER",
      lat: lat || "0.0",
      lon: lon || "0.0",
      address,
      register_id: register_id || "",
      ios_register_id: ios_register_id || "",
      status: status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : "Active",
      exp_date: exp_date || "",
      date_time: new Date().toISOString(),
    });

    const savedUser = await newUser.save();

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: "1",
      message: "User registered successfully",
      result: userResponse,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if both fields provided
    if (!email || !password) {
      return res.status(400).json({
        status: "0",
        message: "Email and Password are required",
      });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "0",
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "0",
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Prepare user response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      status: "1",
      message: "Login successful",
      result: userResponse,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// PROFILE
export const getProfile = async (req, res) => {
  try {
    const { user_id } = req.query; 

    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "User ID (user_id) is required",
      });
    }

    // Find user by numeric 'id' (not _id)
    const user = await User.findOne({ id: Number(user_id) }).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "1",
      message: "Profile fetched successfully",
      result: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { user_id } = req.query; // user_id query se lo
    const updateData = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "User ID (user_id) is required",
      });
    }

    // 🖼️ Agar image upload ki gayi hai (multer se)
    if (req.file) {
      updateData.image = `/uploads/UserImage/${req.file.filename}`;
    }

    // 🔍 Update user by id (not _id)
    const updatedUser = await User.findOneAndUpdate(
      { id: Number(user_id) },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "1",
      message: "Profile updated successfully",
      result: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};
