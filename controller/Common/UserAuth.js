import User from "../../Model/CommonModel/UserAuthModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER - Handles both USER and VENDOR
export const registerUser = async (req, res) => {
  try {
    //  Merge query params and body (in case some fields come from query)
    const data = { ...req.body, ...req.query };

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
      rating,
      fcm_token,
    } = data;

    let image = "";
    let previous_job = [];

    if (type === "USER") {
      image = req.files?.image
        ? `https://tenalpa-backend.onrender.com/uploads/UserImage/profileImage/${req.files.image[0].filename}`
        : "";
    } else if (type === "VENDOR") {
      if (req.files?.previous_job?.length) {
        image = `https://tenalpa-backend.onrender.com/uploads/VendorImage/previousImage/${req.files.previous_job[0].filename}`;
        previous_job = req.files.previous_job.map(
          (file) =>
            `https://tenalpa-backend.onrender.com/uploads/VendorImage/previousImage/${file.filename}`
        );
      }
    }

    //  Common validation for all users
    if (!first_name || !last_name || !mobile || !email || !password || !type) {
      return res.status(400).json({
        status: "0",
        message: "All required fields must be filled",
      });
    }

    //  Type-specific validation
    if (type === "VENDOR") {
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

    //  Check duplicates
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

    //  Create user data object
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
      fcm_token: fcm_token,
    };

    //  Add type-specific fields
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
      userData.rating = rating || 0;
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
    const { email, type, password } = req.query;

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

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ id: 1 }); // id wise sorting

    res.status(200).json({
      status: "1",
      message: "All users fetched successfully",
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// GET USER PROFILE BY ID
export const getUserProfile = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required",
      });
    }

    const user = await User.findOne({ id: Number(user_id) });

    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    // Convert to object and remove sensitive data
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      status: "1",
      message: "User profile fetched successfully",
      result: userData,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { user_id } = req.query;
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
      address,
      lat,
      lon,
      type, // USER or VENDOR
      status,
    } = req.query;

    const user = await User.findOne({ id: Number(user_id) });
    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    let image = user.image;
    let previous_job = user.previous_job || [];

    if (type === "USER") {
      if (req.files?.image?.[0]) {
        image = `https://tenalpa-backend.onrender.com/uploads/UserImage/profileImage/${req.files.image[0].filename}`;
      }
    }

    if (type === "VENDOR") {
      if (req.files?.image?.[0]) {
        image = `https://tenalpa-backend.onrender.com/uploads/VendorImage/profileImage/${req.files.image[0].filename}`;
      }

      if (req.files?.previous_job?.length) {
        previous_job = req.files.previous_job.map(
          (file) =>
            `https://tenalpa-backend.onrender.com/uploads/VendorImage/previousImage/${file.filename}`
        );
      }
    }

    //  Update user details
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.abn_number = abn_number || user.abn_number;
    user.business_name = business_name || user.business_name;
    user.service_offered = service_offered || user.service_offered;
    user.availability = availability || user.availability;
    user.emergency = emergency || user.emergency;
    user.charges = charges || user.charges;
    user.enter_hour_rate = enter_hour_rate || user.enter_hour_rate;
    // ✅ Simple update for mobile fields
    if (mobile) {
      user.mobile = mobile;
      user.mobile_with_code = `+91${mobile}`;
    }

    user.email = email || user.email;
    user.address = address || user.address;
    user.lat = lat || user.lat;
    user.lon = lon || user.lon;
    user.status = status || user.status;
    user.image = image;
    user.previous_job = previous_job;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      status: "1",
      message: "Profile updated successfully",
      result: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// API to update FCM token
export const updateFCMToken = async (req, res) => {
  try {
    const { user_id, fcm_token } = req.body;

    // Validate token format
    if (!fcm_token || fcm_token.length < 50) {
      return res.status(400).json({
        success: false,
        message: "Invalid FCM token format",
      });
    }

    await User.updateOne({ id: user_id }, { $set: { fcm_token: fcm_token } });

    res.status(200).json({
      success: true,
      message: "FCM token updated successfully",
    });
  } catch (error) {
    console.error("Error updating FCM token:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
