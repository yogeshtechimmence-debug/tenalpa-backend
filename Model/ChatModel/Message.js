import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    messageId: { type: String, unique: true },
    conversationId: { type: String, required: true },

    // User IDs from your authUser model
    sender_user_id: { type: Number, required: true },
    receiver_user_id: { type: Number, required: true },

    // MongoDB ObjectId references
    sender_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authUser",
      required: true,
    },
    receiver_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authUser",
      required: true,
    },

    sender_type: {
      type: String,
      enum: ["USER", "VENDOR"],
      required: true,
    },
    receiver_type: {
      type: String,
      enum: ["USER", "VENDOR"],
      required: true,
    },
    content: { type: String, required: true },
    message_type: {
      type: String,
      enum: ["text", "image", "file", "location"],
      default: "text",
    },

    // Location specific fields
    location_data: {
      latitude: { type: String },
      longitude: { type: String },
      address: { type: String },
      place_name: { type: String },
    },

    // Image specific fields
    image_data: {
      image_url: { type: String },
      image_name: { type: String },
      image_size: { type: String },
      thumbnail_url: { type: String }
    },

    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for better performance
messageSchema.index({ conversationId: 1, timestamp: 1 });
messageSchema.index({ sender_user_id: 1, receiver_user_id: 1 });
messageSchema.index({ sender_ref: 1, receiver_ref: 1 });

export default mongoose.model("Message", messageSchema);