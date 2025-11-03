import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, unique: true, required: true },
    recipient_user_id: { type: Number, required: true },
    recipient_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authUser",
      required: true,
    },
    sender_user_id: { type: Number, required: true },
    sender_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authUser",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "NEW_MESSAGE", 
        "MESSAGE_DELIVERED", 
        "MESSAGE_READ", 
        "TYPING_START", 
        "TYPING_STOP", 
        "USER_ONLINE", 
        "USER_OFFLINE"
      ],
      required: true,
    },
    title: { type: String },
    message: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    is_read: { type: Boolean, default: false },
    expires_at: { type: Date },
  },
  { timestamps: true }
);

// Indexes
notificationSchema.index({ recipient_user_id: 1, is_read: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days

export default mongoose.model("Notification", notificationSchema);