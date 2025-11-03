import mongoose from "mongoose";

const UserNotificationSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  user_id: { type: Number },
  serviece_id: { type: Number },
  notification_title: { type: String },
  notification_discription: { type: String },
  serviece_type: { type: String },
  location: { type: String },
  Date: { type: String },
  time: { type: String },
  vendor_id: { type:String },
  vendor_name: { type: String },
  vendor_mobile: { type: String },
  vendor_image: { type: String },
}, { timestamps: true });

export default mongoose.model("UserNotification", UserNotificationSchema);
