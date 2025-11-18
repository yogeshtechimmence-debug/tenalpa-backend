import mongoose from "mongoose";
const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      description: "Duration of plan in months",
    },
    descripation: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
