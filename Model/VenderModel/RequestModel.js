import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    user_id: { type: Number },
    full_name: { type: String },
    user_mobile: { type: String },
    serviece_id: { type: Number },
    serviece_type: { type: String },
    location: { type: String },
    Date: { type: String },
    time: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("request", RequestSchema);
