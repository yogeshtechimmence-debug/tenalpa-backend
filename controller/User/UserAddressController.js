import UserAddress from "../../Model/UserModel/UserAddressModel.js";
import User from "../../Model/UserModel/AuthModel.js";

// Add User Address
export const addUserAddress = async (req, res) => {
  try {
    const { user_id, area_name, neighborhood, zipcode } = req.query;

    if (!user_id || !area_name || !neighborhood || !zipcode) {
      return res.status(400).json({
        status: "0",
        message:
          "All fields (user_id, area_name, neighborhood, zipcode) are required",
      });
    }

    const user = await User.findOne({ id: Number(user_id) });

    if (!user) {
      return res.status(404).json({
        status: "0",
        message: "User not found",
      });
    }

    await UserAddress.deleteMany({ user_id: Number(user_id) });

    const address = new UserAddress({
      user_id,
      area_name,
      neighborhood,
      zipcode,
      address: user.address || "",
      user_name: `${user.first_name} ${user.last_name}`,
      user_mobile: user.mobile,
    });

    await address.save();

    res.status(201).json({
      status: "1",
      message: "User address uploaded successfully",
      result: address,
    });
  } catch (error) {
    console.error("Address upload failed:", error);
    res.status(500).json({
      status: "0",
      message: "Address upload failed",
      error: error.message,
    });
  }
};

// Get All User Addresses
export const getUserAddressById = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required",
      });
    }

    const addresses = await UserAddress.find({ user_id: Number(user_id) });

    if (addresses.length === 0) {
      return res.status(404).json({
        status: "0",
        message: "No addresses found for this user",
      });
    }

    res.status(200).json({
      status: "1",
      message: "User address fetched successfully",
      result: addresses,
    });
  } catch (error) {
    console.error("Error fetching user address:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};

// Update user address
export const updateUserAddress = async (req, res) => {
  try {
    const { user_id, area_name, neighborhood, zipcode } = req.query;

    // Validation
    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required",
      });
    }

    if (!area_name && !neighborhood && !zipcode) {
      return res.status(400).json({
        status: "0",
        message:
          "At least one field (area_name, neighborhood, zipcode) is required to update",
      });
    }

    // Find and update address
    const updatedAddress = await UserAddress.findOneAndUpdate(
      { user_id: Number(user_id) },
      { $set: { area_name, neighborhood, zipcode } },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        status: "0",
        message: "Address not found for this user",
      });
    }

    res.status(200).json({
      status: "1",
      message: "User address updated successfully",
      result: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating user address:", error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message,
    });
  }
};
