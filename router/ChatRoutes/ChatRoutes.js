// routes/chatRoutes.js
import express from "express";
import { 
  getConversations, 
  getMessages, 
  getUnreadCount, 
  uploadChatImage
} from "../../controller/Chat/ChatController.js";
import createMulter from "../../middleware/upload.js";
import { deleteNotification, getNotifications, getUnreadNotificationCount, markAllAsRead, markAsRead } from "../../controller/Chat/ChatNotification.js";

const router = express.Router();

router.get("/conversations", getConversations);
router.get("/messages", getMessages);
router.get("/unread-count", getUnreadCount);

const ChatImage = createMulter("ChatImage", "chatImages");
router.post("/chat-upload-image", ChatImage.single("image"), uploadChatImage);


// ------------------- Chat Notification Routes-------------------


router.get("/notifications", getNotifications);
router.get("/notifications/unread-count", getUnreadNotificationCount);
router.post("/notifications/mark-read", markAsRead);
router.post("/notifications/mark-all-read", markAllAsRead);
router.delete("/notifications/delete", deleteNotification);


export default router;