import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/AuthModel.js";

// // 🔹 REGISTER
// export const registerUser = async (req, res) => {
//   try {
//     const {
//       full_name,
//       business_name,
//       abn_number,
//       email_address,
//       contact,
//       address,
//       password,
//       confirm_password,
//     } = req.body;

//     // Image file path from multer
//     const user_image = req.file ? `/uploads/UserImage/${req.file.filename}` : "";


//     // 1️⃣ Check required fields
//     if (
//       !full_name ||
//       !business_name ||
//       !abn_number ||
//       !email_address ||
//       !contact ||
//       !address ||
//       !password ||
//       !confirm_password
//     ) {
//       return res.status(400).json({
//         status: "0",
//         message: "All fields are required",
//       });
//     }

//     // 2️⃣ Check password match
//     if (password !== confirm_password) {
//       return res.status(400).json({
//         status: "0",
//         message: "Password and Confirm Password do not match",
//       });
//     }

//     // 3️⃣ Check if user exists
//     const existingUser = await User.findOne({ email_address });
//     if (existingUser) {
//       return res.status(400).json({
//         status: "0",
//         message: "Email already exists",
//       });
//     }

//     // 4️⃣ Hash password
//     const hashPassword = await bcrypt.hash(password, 10);

//     // 5️⃣ Save user
//     const newUser = new User({
//       user_image,
//       full_name,
//       business_name,
//       abn_number,
//       email_address,
//       contact,
//       address,
//       password: hashPassword,
//     });

//     const savedUser = await newUser.save();

//     res.status(201).json({
//       status: "1",
//       message: "User registered successfully",
//       result: savedUser,
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({
//       status: "0",
//       message: "Server error",
//     });
//   }
// };


export const registerUser = async (req, res) => {
  try {
    const {
      full_name,
      business_name,
      abn_number,
      email_address,
      contact,
      address,
      password,
      confirm_password,
    } = req.body;

    // Image file path from multer
    const user_image = req.file ? `/uploads/UserImage/${req.file.filename}` : "";

    // 1️⃣ Check required fields
    if (
      !full_name ||
      !business_name ||
      !abn_number ||
      !email_address ||
      !contact ||
      !address ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({
        status: "0",
        message: "All fields are required",
      });
    }

    // 2️⃣ Check password match
    if (password !== confirm_password) {
      return res.status(400).json({
        status: "0",
        message: "Password and Confirm Password do not match",
      });
    }

    // 3️⃣ Check if email exists
    const existingEmail = await User.findOne({ email_address });
    if (existingEmail) {
      return res.status(400).json({
        status: "0",
        message: "Email already exists",
      });
    }

    // 3️⃣ Check if email exists
    const existingContact = await User.findOne({ contact });
    if (existingContact) {
      return res.status(400).json({
        status: "0",
        message: "Contact already exists",
      });
    }



    // 4️⃣ Check if ABN number exists
    const existingABN = await User.findOne({ abn_number });
    if (existingABN) {
      return res.status(400).json({
        status: "0",
        message: "ABN number already exists",
      });
    }

    // 5️⃣ Hash passwords
    const hashPassword = await bcrypt.hash(password, 10);
    const hashConfirmPassword = await bcrypt.hash(confirm_password, 10);

    // 6️⃣ Save user
    const newUser = new User({
      user_image,
      full_name,
      business_name,
      abn_number,
      email_address,
      contact,
      address,
      password: hashPassword,
      confirm_password: hashConfirmPassword,
    });

    const savedUser = await newUser.save();

    // 7️⃣ Remove passwords from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    delete userResponse.confirm_password;

    res.status(201).json({
      status: "1",
      message: "User registered successfully",
      result: userResponse,
    });

  } catch (error) {
    console.error("Register error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: "0",
        message: `${field} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: "0",
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};

// 🔹 LOGIN
// export const loginUser = async (req, res) => {
//   try {
//     const { email_address, password } = req.body;

//     if (!email_address || !password) {
//       return res.status(400).json({
//         status: "0",
//         message: "Email and Password are required",
//       });
//     }

//     const user = await User.findOne({ email_address });
//     if (!user) {
//       return res.status(400).json({
//         status: "0",
//         message: "Invalid email or password",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         status: "0",
//         message: "Invalid email or password",
//       });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       status: "1",
//       message: "Login successful",
//       result: { user, token },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       status: "0",
//       message: "Server error",
//     });
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { email_address, password } = req.body;

    // 1️⃣ Check if email and password are provided
    if (!email_address || !password) {
      return res.status(400).json({
        status: "0",
        message: "Email and Password are required",
      });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email_address });
    if (!user) {
      return res.status(401).json({
        status: "0",
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "0",
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email_address 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Remove passwords from user object
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.confirm_password;

    res.status(200).json({
      status: "1",
      message: "Login successful",
      result: { 
        user: userResponse, 
        token 
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: "0",
        message: "Invalid token"
      });
    }

    // Handle token expiration
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: "0",
        message: "Token expired"
      });
    }

    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};