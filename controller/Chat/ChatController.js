import User from "../../Model/CommonModel/UserAuthModel.js";
import Message from "../../Model/ChatModel/Message.js";

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required"
      });
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender_user_id: parseInt(user_id) },
            { receiver_user_id: parseInt(user_id) }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$conversationId",
          last_message: { $first: "$content" },
          last_timestamp: { $first: "$timestamp" },
          unread_count: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$receiver_user_id", parseInt(user_id)] },
                  { $eq: ["$status", "delivered"] }
                ]}, 1, 0
              ]
            }
          },
          partner_user_id: {
            $first: {
              $cond: [
                { $eq: ["$sender_user_id", parseInt(user_id)] },
                "$receiver_user_id",
                "$sender_user_id"
              ]
            }
          }
        }
      },
      {
        $sort: { last_timestamp: -1 }
      }
    ]);

    // Populate partner details
    for (let conversation of conversations) {
      const partner = await User.findOne({ 
        id: conversation.partner_user_id 
      }).select('id first_name last_name business_name mobile email image type');
      
      conversation.partner_details = partner;
    }
    
    res.json({
      status: "1",
      message: "Conversations fetched successfully",
      conversations
    });
    
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      status: "0",
      message: "Server error",
      error: error.message
    });
  }
};

// Get messages for a specific conversation
export const getMessages = async (req, res) => {
  try {
    const { conversation_id, user_id, page = 1, limit = 50 } = req.query;
    
    if (!conversation_id || !user_id) {
      return res.status(400).json({
        status: "0",
        message: "conversation_id and user_id are required"
      });
    }

    const messages = await Message.find({ conversationId: conversation_id })
      .sort({ timestamp: 1 }) // Oldest first for chat UI
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sender_ref', 'id first_name last_name business_name image type')
      .populate('receiver_ref', 'id first_name last_name business_name image type');
    
    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId: conversation_id,
        receiver_user_id: parseInt(user_id),
        status: 'delivered'
      },
      { status: 'read' }
    );
    
    const totalMessages = await Message.countDocuments({ 
      conversationId: conversation_id 
    });
    
    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      messageId: msg.messageId,
      sender_user_id: msg.sender_user_id,
      receiver_user_id: msg.receiver_user_id,
      sender_name: `${msg.sender_ref.first_name} ${msg.sender_ref.last_name}`,
      sender_image: msg.sender_ref.image,
      sender_type: msg.sender_type,
      receiver_type: msg.receiver_type,
      content: msg.content,
      message_type: msg.message_type,
      location_data: msg.location_data,
      image_data: msg.image_data,
      timestamp: msg.timestamp,
      status: msg.status,
      is_own: msg.sender_user_id === parseInt(user_id)
    }));
    
    res.json({
      status: "1",
      message: "Messages fetched successfully",
      messages: formattedMessages,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalMessages / limit),
        total_messages: totalMessages,
        has_more: (page * limit) < totalMessages
      }
    });
    
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      status: "0",
      message: "Server error", 
      error: error.message
    });
  }
};


// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        status: "0",
        message: "user_id is required"
      });
    }

    const unreadCount = await Message.countDocuments({
      receiver_user_id: parseInt(user_id),
      status: 'delivered'
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

// Image upload API - Updated with consistent field names
export const uploadChatImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "0",
        message: "No image file provided",
      });
    }

    // Image URL generate karein
    const imageUrl = `https://tenalpa-backend.onrender.com/uploads/ChatImage/chatImages/${req.file.filename}`;

    res.json({
      status: "1",
      message: "Image uploaded successfully",
      image_data: {
        image_url: imageUrl, // Consistent field name
        image_name: req.file.originalname,
        image_size: (req.file.size / 1024 / 1024).toFixed(2) + " MB",
        thumbnail_url: imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      status: "0",
      message: "Image upload failed",
      error: error.message,
    });
  }
};
