// models/Feedback.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const feedbackSchema = new Schema(
  {
    // If you have authentication, store user id. Optional.
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },

    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    // rating 1..5 (optional)
    rating: {
      type: Number,
      min: [1, "Minimum is 1"],
      max: [5, "Maximum is 5"],
      required: false,
    },

    // feedback message / complaint
    message: { type: String, required: true, trim: true, maxlength: 2000 },

    // status for admin tracking
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved", "dismissed"],
      default: "new",
    },

    // admin response if any
    adminReply: {
      text: { type: String, trim: true },
      repliedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
      repliedAt: { type: Date },
    },

    // optional metadata
    meta: {
      ip: String,
      userAgent: String,
      // other small details
    },
  },
  { timestamps: true }
);

export default model("Feedback", feedbackSchema);
