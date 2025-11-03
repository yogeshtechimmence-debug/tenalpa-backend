import User from "../../Model/CommonModel/UserAuthModel.js";
import Message from "../../Model/ChatModel/Message.js";
import { sendNotification } from "../SendNotification.js";
import Notification from "../../Model/ChatModel/NotificationModel.js";


// // Store active connections

// Store active connections
const activeConnections = new Map();
// handleMessage function mein debug add karein
const handleMessage = async (message, senderId, senderType) => {
  try {
    console.log(" RAW MESSAGE RECEIVED:", message);
    
    // Check if message is already parsed
    let parsedMessage;
    if (typeof message === 'string') {
      parsedMessage = JSON.parse(message);
    } else {
      parsedMessage = message;
    }
    
    console.log(" PARSED MESSAGE:", parsedMessage);
    console.log(" SENDER ID:", senderId, "TYPE:", senderType);

    const {
      type,
      receiverId,
      content,
      timestamp,
      message_type,
      location_data,
      image_data,
    } = parsedMessage;

    console.log(" MESSAGE FIELDS:", {
      type,
      receiverId, 
      content,
      message_type,
      hasLocation: !!location_data,
      hasImage: !!image_data
    });

    //  YEH SWITCH CASE ADD KAREIN
    switch (type) {
      case "chat_message":
        await handleChatMessage(
          senderId,
          receiverId,
          content,
          senderType,
          timestamp,
          message_type,
          location_data,
          image_data
        );
        break;

      case "typing_start":
      case "typing_stop":
        await handleTyping(senderId, receiverId, type, senderType);
        break;

      case "message_delivered":
      case "message_read":
        await handleMessageStatus(senderId, receiverId, parsedMessage.messageId, type);
        break;

      case "ping":
        handlePing(senderId);
        break;

      default:
        console.log("Unknown message type:", type);
        const senderConnection = activeConnections.get(senderId.toString());
        if (senderConnection) {
          senderConnection.ws.send(
            JSON.stringify({
              type: "error",
              message: `Unknown message type: ${type}`
            })
          );
        }
    }
    
  } catch (error) {
    console.error(" MESSAGE PARSING ERROR:", error);
    console.error(" ERROR STACK:", error.stack);
    console.error(" RAW MESSAGE THAT FAILED:", message);

    const senderConnection = activeConnections.get(senderId.toString());
    if (senderConnection) {
      senderConnection.ws.send(
        JSON.stringify({
          type: "error",
          message: `Invalid message format: ${error.message}`,
        })
      );
    }
  }
};

//  IMPROVED: Handle chat message with notifications
const handleChatMessage = async (
  senderId,
  receiverId,
  content,
  senderType,
  timestamp,
  message_type = "text",
  location_data = null,
  image_data = null
) => {
  try {
    console.log(" START: handleChatMessage with notifications");

    // Step 1: Basic validation
    if (!senderId || !receiverId) {
      throw new Error("Missing senderId or receiverId");
    }

    // Step 2: Find users in database
    const senderUser = await User.findOne({ id: parseInt(senderId) });
    const receiverUser = await User.findOne({ id: parseInt(receiverId) });

    if (!senderUser || !receiverUser) {
      throw new Error("Sender or receiver not found in database");
    }

    // Step 3: Generate IDs and create message data
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const conversationId = [senderUser.id.toString(), receiverUser.id.toString()].sort().join("_");

    // Step 4: Create message document
    const messageData = {
      messageId,
      conversationId,
      sender_user_id: senderUser.id,
      receiver_user_id: receiverUser.id,
      sender_ref: senderUser._id,
      receiver_ref: receiverUser._id,
      sender_type: senderType,
      receiver_type: receiverUser.type,
      content: content,
      message_type: message_type,
      timestamp: new Date(timestamp || Date.now()),
      status: "sent",
    };

    // Add location data if present
    if (message_type === "location" && location_data && location_data.latitude) {
      messageData.location_data = {
        latitude: location_data.latitude,
        longitude: location_data.longitude,
        address: location_data.address,
        place_name: location_data.place_name,
      };
    }

    // Add image data if present
    if (message_type === "image" && image_data && image_data.image_url) {
      messageData.image_data = {
        image_url: image_data.image_url,
        image_name: image_data.image_name,
        image_size: image_data.image_size,
        thumbnail_url: image_data.thumbnail_url || image_data.image_url,
      };
    }

    // Step 5: Save to database
    const savedMessage = await Message.create(messageData);
    console.log(" Message saved to database with ID:", savedMessage._id);

    // Step 6: Prepare message for WebSocket
    const messageForReceiver = {
      type: "chat_message",
      messageId: savedMessage.messageId,
      sender_user_id: senderUser.id,
      sender_type: senderType,
      sender_name: `${senderUser.first_name} ${senderUser.last_name}`,
      sender_business: senderUser.business_name,
      content: content,
      message_type: savedMessage.message_type,
      timestamp: savedMessage.timestamp,
    };

    if (message_type === "image" && image_data) {
      messageForReceiver.image_data = image_data;
    } else if (message_type === "location" && location_data) {
      messageForReceiver.location_data = location_data;
    }

    //  STEP 7: ALWAYS CREATE NOTIFICATION (Online or Offline)
    const notification = await createNotification({
      recipient_user_id: receiverUser.id,
      recipient_ref: receiverUser._id,
      sender_user_id: senderUser.id,
      sender_ref: senderUser._id,
      type: "NEW_MESSAGE",
      title: `${senderUser.first_name} ${senderUser.last_name}`,
      message: content.length > 50 ? content.substring(0, 50) + '...' : content,
      data: {
        messageId: savedMessage.messageId,
        conversationId: savedMessage.conversationId,
        sender_name: `${senderUser.first_name} ${senderUser.last_name}`,
        sender_business: senderUser.business_name,
        message_type: savedMessage.message_type,
        content: content,
        image_data: image_data,
        location_data: location_data
      }
    });

    console.log(" Notification created for receiver:", receiverUser.id);

    // Step 8: Check connections and send real-time
    const senderConnection = activeConnections.get(senderId.toString());
    const receiverConnection = activeConnections.get(receiverId.toString());

    // Send to receiver if online
    if (receiverConnection) {
      console.log(" Receiver online, sending real-time message");
      
      // Send chat message
      receiverConnection.ws.send(JSON.stringify(messageForReceiver));
      
      // Update message status to delivered
      await Message.updateOne(
        { messageId: savedMessage.messageId },
        { status: "delivered" }
      );

      // Update notification to delivered
      await Notification.updateOne(
        { notificationId: notification.notificationId },
        { 
          type: "MESSAGE_DELIVERED",
          title: "Message Delivered",
          message: `Message delivered to ${receiverUser.first_name}`
        }
      );
    } else {
      console.log(" Receiver offline, sending push notification");
      
      //  Send push notification for offline users
      await sendNotification(receiverUser, notification);
    }

    // Send confirmation to sender
    if (senderConnection) {
      senderConnection.ws.send(
        JSON.stringify({
          type: "message_sent",
          messageId: savedMessage.messageId,
          timestamp: savedMessage.timestamp,
          status: receiverConnection ? "delivered" : "sent",
          message_type: savedMessage.message_type,
          notification_created: true
        })
      );
    }

    console.log(" END: handleChatMessage - SUCCESS");
  } catch (error) {
    console.error(" handleChatMessage ERROR:", error);
    
    const senderConnection = activeConnections.get(senderId.toString());
    if (senderConnection) {
      senderConnection.ws.send(
        JSON.stringify({
          type: "error",
          message: `Send failed: ${error.message}`,
        })
      );
    }
  }
};

//  IMPROVED: Handle message status with notifications
const handleMessageStatus = async (senderId, receiverId, messageId, status) => {
  try {
    console.log(`Updating message status: ${messageId} -> ${status}`);

    await Message.updateOne(
      { messageId },
      { status: status === "message_read" ? "read" : "delivered" }
    );

    // Find users for notification
    const senderUser = await User.findOne({ id: parseInt(senderId) });
    const receiverUser = await User.findOne({ id: parseInt(receiverId) });

    if (senderUser && receiverUser) {
      //  Status update notification
      await createNotification({
        recipient_user_id: senderUser.id,
        recipient_ref: senderUser._id,
        sender_user_id: receiverUser.id,
        sender_ref: receiverUser._id,
        type: status === "message_read" ? "MESSAGE_READ" : "MESSAGE_DELIVERED",
        title: status === "message_read" ? "Message Read" : "Message Delivered",
        message: status === "message_read" ? 
          `${receiverUser.first_name} read your message` : 
          `Message delivered to ${receiverUser.first_name}`,
        data: { messageId }
      });
    }

    // Notify sender about status update
    const senderConnection = activeConnections.get(senderId.toString());
    if (senderConnection) {
      senderConnection.ws.send(
        JSON.stringify({
          type: "message_status_updated",
          messageId,
          status: status === "message_read" ? "read" : "delivered",
        })
      );
    }
  } catch (error) {
    console.error("Error updating message status:", error);
  }
};

//  IMPROVED: Create notification function
const createNotification = async (notificationData) => {
  try {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const notification = await Notification.create({
      notificationId,
      ...notificationData,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    console.log(` Notification created: ${notificationId} for user ${notificationData.recipient_user_id}`);
    
    // Send real-time notification if user is online
    const recipientConnection = activeConnections.get(notificationData.recipient_user_id.toString());
    if (recipientConnection && recipientConnection.ws.readyState === 1) {
      console.log(" Sending real-time notification to online user");
      recipientConnection.ws.send(
        JSON.stringify({
          type: "notification",
          notification: {
            notificationId: notification.notificationId,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data,
            timestamp: notification.createdAt,
            is_read: notification.is_read
          }
        })
      );
    }
    
    return notification;
  } catch (error) {
    console.error(" Error creating notification:", error);
    throw error;
  }
};

//  YEH NAYA FUNCTION ADD KAREIN (WebSocketController.js mein)
const sendPendingNotifications = async (userId) => {
  try {
    console.log(` Checking pending notifications for user: ${userId}`);
    
    const pendingNotifications = await Notification.find({
      recipient_user_id: parseInt(userId),
      is_read: false
    }).sort({ createdAt: -1 }).limit(20);

    const userConnection = activeConnections.get(userId.toString());
    
    if (userConnection && pendingNotifications.length > 0) {
      console.log(` Sending ${pendingNotifications.length} pending notifications to user: ${userId}`);
      
      // Har notification individually bhejein
      pendingNotifications.forEach(notification => {
        userConnection.ws.send(
          JSON.stringify({
            type: "notification",
            notification: {
              notificationId: notification.notificationId,
              type: notification.type,
              title: notification.title,
              message: notification.message,
              data: notification.data,
              timestamp: notification.createdAt,
              is_read: notification.is_read
            }
          })
        );
      });
    }
  } catch (error) {
    console.error(" Error sending pending notifications:", error);
  }
};

//  IMPROVED: Handle typing with notifications
const handleTyping = async (senderId, receiverId, action, senderType) => {
  console.log(`Typing ${action} from ${senderId} to ${receiverId}`);

  const receiverConnection = activeConnections.get(receiverId.toString());
  
  // Find users for notification
  const senderUser = await User.findOne({ id: parseInt(senderId) });
  const receiverUser = await User.findOne({ id: parseInt(receiverId) });
  
  if (receiverConnection && senderUser && receiverUser) {
    // Send real-time typing indicator
    receiverConnection.ws.send(
      JSON.stringify({
        type: action,
        sender_user_id: senderId,
        sender_type: senderType,
      })
    );
    
    //  Create typing notification
    await createNotification({
      recipient_user_id: receiverUser.id,
      recipient_ref: receiverUser._id,
      sender_user_id: senderUser.id,
      sender_ref: senderUser._id,
      type: action === "typing_start" ? "TYPING_START" : "TYPING_STOP",
      title: action === "typing_start" ? "Typing..." : "",
      message: action === "typing_start" ? `${senderUser.first_name} is typing...` : "",
      data: { 
        action: action,
        sender_name: `${senderUser.first_name} ${senderUser.last_name}`
      }
    });
  }
};

//  handlePing function add karein
const handlePing = (senderId) => {
  const senderConnection = activeConnections.get(senderId.toString());
  if (senderConnection) {
    senderConnection.ws.send(
      JSON.stringify({
        type: "pong",
        timestamp: new Date().toISOString(),
      })
    );
  }
};

//  NEW: Broadcast user online/offline status
const broadcastUserStatus = async (userId, status) => {
  try {
    const user = await User.findOne({ id: parseInt(userId) });
    if (!user) return;

    // Find all users who have conversations with this user
    const conversations = await Message.distinct('conversationId', {
      $or: [
        { sender_user_id: parseInt(userId) },
        { receiver_user_id: parseInt(userId) }
      ]
    });

    // Get all unique user IDs from these conversations
    const partnerUserIds = new Set();
    for (const convId of conversations) {
      const userIds = convId.split('_').map(id => parseInt(id));
      userIds.forEach(id => {
        if (id !== parseInt(userId)) {
          partnerUserIds.add(id);
        }
      });
    }

    // Send status update to all partners who are online
    partnerUserIds.forEach(async (partnerId) => {
      const partnerConnection = activeConnections.get(partnerId.toString());
      if (partnerConnection) {
        partnerConnection.ws.send(
          JSON.stringify({
            type: "user_status_update",
            user_id: userId,
            status: status,
            timestamp: new Date().toISOString()
          })
        );
      }

      //  Create notification for status change
      const partnerUser = await User.findOne({ id: partnerId });
      if (partnerUser) {
        await createNotification({
          recipient_user_id: partnerId,
          recipient_ref: partnerUser._id,
          sender_user_id: parseInt(userId),
          sender_ref: user._id,
          type: status === 'ONLINE' ? "USER_ONLINE" : "USER_OFFLINE",
          title: status === 'ONLINE' ? "User Online" : "User Offline",
          message: `${user.first_name} is now ${status.toLowerCase()}`,
          data: { user_status: status }
        });
      }
    });
  } catch (error) {
    console.error("Error broadcasting user status:", error);
  }
};

//  UPDATED: WebSocket connection with status notifications
export const handleWebSocketConnection = (ws, req) => {
  const userId = req.query.userId;
  const userType = req.query.userType;

  console.log(`New WebSocket connection: ${userId} (${userType})`);

  // Store connection
  activeConnections.set(userId, {
    ws,
    userType,
    userId,
  });

    //  YEH LINE ADD KAREIN - User online aaye toh pending notifications bhejein
  sendPendingNotifications(userId);

  //  Send online status to all relevant users
  broadcastUserStatus(userId, 'ONLINE');

  // Handle messages
  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      await handleMessage(parsedMessage, userId, userType);
    } catch (error) {
      console.error("Message parsing error:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  // Handle disconnect - add notification
  ws.on("close", async () => {
    console.log(`Connection closed: ${userId}`);
    
    //  Send offline status to all relevant users
    await broadcastUserStatus(userId, 'OFFLINE');
    
    activeConnections.delete(userId);
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "connection_established",
      message: "Connected successfully",
      userId,
      userType,
      timestamp: new Date().toISOString(),
    })
  );
};

// Check if user is online
export const isUserOnline = (userId) => {
  return activeConnections.has(userId.toString());
};

// Get all online users
export const getOnlineUsers = () => {
  const onlineUsers = [];
  activeConnections.forEach((connection, userId) => {
    onlineUsers.push({
      user_id: userId,
      user_type: connection.userType,
    });
  });
  return onlineUsers;
};
