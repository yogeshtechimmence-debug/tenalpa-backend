import mongoose from "mongoose";

const JobPostSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    name: { type: String },
    category: { type: String, required: true },
    job_title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    image: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("JobPost", JobPostSchema);
