import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  user_id: { type: Number, required: true  },
  services_category: { type: String, required: true },
  sub_category: { type: String, required: true },
  servies_price: { type: String, required: true },
  description: { type: String, required: true },
  image: [{ type: String }],
});

export default mongoose.model("venderServices", servicesSchema);
