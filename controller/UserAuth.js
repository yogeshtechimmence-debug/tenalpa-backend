import User from "../Model/UserAuthModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER - Handles both USER and VENDOR
export const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      abn_number,
      business_name,
      service_offered,
      availability,
      emergency,
      charges,
      enter_hour_rate,
      mobile,
      email,
      password,
      address,
      lat,
      lon,
      type, // "USER" or "VENDOR"
      register_id,
      ios_register_id,
      status,
    } = req.body; 

    // Handle file uploads based on type
    let image = "";
    let previous_job = [];

    if (type === "USER") {
      image = req.file
        ? `https://tenalpa-backend.onrender.com/uploads/UserImage/profileImage/${req.file.filename}`
        : "";
    } else if (type === "VENDOR") {
      if (req.files && req.files.length > 0) {
        // First file is profile image, rest are previous job images
        image = `https://tenalpa-backend.onrender.com/uploads/VenderImage/previousImage/${req.files[0].filename}`;
        previous_job = req.files
          .slice(1)
          .map(
            (file) =>
              `https://tenalpa-backend.onrender.com/uploads/VenderImage/previousImage/${file.filename}`
          );
      }
    }

    // Common validation for all users
    if (
      !first_name ||
      !last_name ||
      !mobile ||
      !email ||
      !password ||
      !address ||
      !type
    ) {
      return res.status(400).json({
        status: "0",
        message: "All required fields must be filled",
      });
    }

    // Type-specific validation
    if (type === "USER") {
      if (!abn_number || !business_name) {
        return res.status(400).json({
          status: "0",
          message: "ABN number and business name are required for users",
        });
      }
    } else if (type === "VENDOR") {
      if (
        !service_offered ||
        !availability ||
        !emergency ||
        !charges ||
        !enter_hour_rate
      ) {
        return res.status(400).json({
          status: "0",
          message: "All vendor fields must be filled",
        });
      }
    }

    // Check duplicates
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: "0",
        message: "Email already exists",
      });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        status: "0",
        message: "Mobile already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;

    // Create user data object
    const userData = {
      id: newId,
      first_name,
      last_name,
      mobile,
      mobile_with_code: `+91${mobile}`,
      email,
      password: hashedPassword,
      image,
      type: type.toUpperCase(),
      lat: lat || "0.0",
      lon: lon || "0.0",
      address,
      register_id: register_id || "",
      ios_register_id: ios_register_id || "",
      status: status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : "Active",
      date_time: new Date().toISOString(),
    };

    // Add type-specific fields
    if (type === "USER") {
      userData.abn_number = abn_number;
      userData.business_name = business_name;
    } else if (type === "VENDOR") {
      userData.abn_number = abn_number;
      userData.business_name = business_name;
      userData.service_offered = service_offered;
      userData.previous_job = previous_job;
      userData.availability = availability;
      userData.emergency = emergency;
      userData.charges = charges;
      userData.enter_hour_rate = enter_hour_rate;
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: "1",
      message: `${type} registered successfully`,
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

// LOGIN - Handles both USER and VENDOR
export const loginUser = async (req, res) => {
  try {
    const { email, type, password } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({
        status: "0",
        message: "Email, Password and Type are required",
      });
    }

    // Find user by email and type
    const user = await User.findOne({ email, type: type.toUpperCase() });
    if (!user) {
      return res.status(401).json({
        status: "0",
        message: "Please enter correct email or check your user type",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "0",
        message: "Password is incorrect",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare user response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send success response
    res.status(200).json({
      status: "1",
      message: `${user.type} login successful`,
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
