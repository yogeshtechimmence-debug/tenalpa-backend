import Notification from "../../Model/ChatModel/NotificationModel.js";
import User from "../../Model/CommonModel/UserAuthModel.js";

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const { user_id, page = 1, limit = 20, unread_only = false } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required"
      });
    }

    const query = { recipient_user_id: parseInt(user_id) };
    if (unread_only === 'true') {
      query.is_read = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender_ref', 'id first_name last_name business_name image type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient_user_id: parseInt(user_id),
      is_read: false
    });

    res.json({
      status: "1",
      message: "Notifications fetched successfully",
      notifications,
      unread_count: unreadCount,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalNotifications / limit),
        total_notifications: totalNotifications
      }
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.body;
    
    if (!notification_id) {
      return res.status(400).json({
        status: "0",
        message: "notification_id is required"
      });
    }

    await Notification.updateOne(
      { notificationId: notification_id },
      { is_read: true }
    );

    res.json({
      status: "1",
      message: "Notification marked as read"
    });
    
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required"
      });
    }

    await Notification.updateMany(
      { 
        recipient_user_id: parseInt(user_id),
        is_read: false
      },
      { is_read: true }
    );

    res.json({
      status: "1",
      message: "All notifications marked as read"
    });
    
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.body;
    
    if (!notification_id) {
      return res.status(400).json({
        status: "0",
        message: "notification_id is required"
      });
    }

    await Notification.deleteOne({ notificationId: notification_id });

    res.json({
      status: "1",
      message: "Notification deleted successfully"
    });
    
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};

// Get unread notifications count
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required"
      });
    }

    const unreadCount = await Notification.countDocuments({
      recipient_user_id: parseInt(user_id),
      is_read: false
    });

    res.json({
      status: "1",
      unread_count: unreadCount
    });
    
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};