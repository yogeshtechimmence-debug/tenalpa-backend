import mongoose from "mongoose";

const RescheduleSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    user_id: { type: Number, required: true },
    vendor_id: { type: Number },
    book_id: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("reschedule", RescheduleSchema);
