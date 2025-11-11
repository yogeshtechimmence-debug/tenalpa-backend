import User from "../../Model/CommonModel/UserAuthModel.js";

//  Get All Normal Users (type: USER)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type } = req.query;

    const query = {};

    if (type) {
      query.type = type; // USER or VENDOR filter
    }

    if (search) {
      // sirf id ke liye search
      const idNum = Number(search);
      if (!isNaN(idNum)) {
        query.id = idNum;
      } else {
        // agar invalid number diya → empty result
        return res.status(200).json({
          status: "1",
          message: "Users fetched successfully",
          result: [],
          totalPages: 0,
          currentPage: Number(page),
          totalUsers: 0,
        });
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ id: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      status: "1",
      message: "Users fetched successfully",
      result: users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalUsers: total,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};


export const deleteUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        status: "0",
        message: "No user ids provided",
      });
    }

    await User.deleteMany({ id: { $in: ids } });

    res.status(200).json({
      status: "1",
      message: "Users deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({
      status: "0",
      message: "Server error while deleting users",
      error: error.message,
    });
  }
};
