import mongoose from "mongoose";

const inVoiceSchema = new mongoose.Schema(
  {
    id: { type: Number },
    inv_id: { type: String },
    date: { type: String },
    status: { type: String },
    name: { type: String },
    phone: { type: String },
    service: { type: String },
    category: { type: String },
    vendor: { type: String },
    service_date: { type: String },
    payment_mode: { type: String },
    service_price: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("inVoice", inVoiceSchema);
