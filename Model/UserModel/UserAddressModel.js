import mongoose from "mongoose";

const userAddressSchema = mongoose.Schema({
  user_id: { type: Number, required: true }, // store User model ka 'id' field
  area_name: { type: String, required: true },
  neighborhood: { type: String, required: true },
  zipcode: { type: String, required: true },
  user_name: { type: String, required: true },
  user_mobile: { type : String, required: true },
  address: { type: String, default: "" }, // optional full address field
});

export default mongoose.model("UserAddress", userAddressSchema);
