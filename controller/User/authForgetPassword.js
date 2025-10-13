import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../../Model/UserModel/AuthModel.js";
import dotenv from "dotenv";
dotenv.config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP generate function
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// OTP ko hash karne ke liye
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// Forget Password - OTP send
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        status: "0",
        message: "Email are required",
      });
    }

    // User find by mobile
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
        result: {},
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // Save OTP and expiration
    user.otpHash = otpHash;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "1",
      message: "OTP sent successfully on your email",
      result: { user_id: user.id, mobile: user.mobile },
    });
  } catch (error) {
    console.error("ForgetPassword error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      result: {},
    });
  }
};

// Change Password - OTP verify and reset
export const changePassword = async (req, res) => {
  try {
    const { email, otp, new_password } = req.query;

    if (!email || !otp || !new_password) {
      return res.status(400).json({
        status: "0",
        message: "All fields are required",
        result: {},
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
        result: {},
      });
    }

    // OTP validation
    if (!user.otpHash || !user.otpExpires) {
      return res
        .status(400)
        .json({ status: "0", message: "OTP not requested", result: {} });
    }

    if (new Date() > user.otpExpires) {
      return res
        .status(400)
        .json({ status: "0", message: "OTP expired", result: {} });
    }

    if (hashOtp(otp) !== user.otpHash) {
      return res
        .status(400)
        .json({ status: "0", message: "Invalid OTP", result: {} });
    }

    // Reset password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;

    // Clear OTP
    user.otpHash = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "1",
      message: "Password changed successfully",
      result: { user_id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("ChangePassword error:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      result: {},
    });
  }
};
