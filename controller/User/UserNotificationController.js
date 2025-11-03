import UserNotification from "../../Model/UserModel/UserNotification.js";

export const GetUserNotification = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({
      status: false,
      message: "User ID is required",
    });
  }

  
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  
  const notificationData = await UserNotification.find({
    user_id: Number(user_id),
  }).sort({ createdAt: -1 });

 
  const todayCount = await UserNotification.countDocuments({
    user_id: Number(user_id),
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  //  Response
  res.status(200).json({
    status: true,
    message:
      todayCount > 0
        ? `Today new ${todayCount} notification${todayCount !== 1 ? "s" : ""}`
        : "No new notifications today",
    total_today: todayCount,
    total_all: notificationData.length,
    result: notificationData,
  });
};
