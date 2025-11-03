import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import {
  handleWebSocketConnection,
  getOnlineUsers,
} from "../controller/Chat/WebSocketController.js";
import chalk from "chalk";
import figures from "figures";

const router = express.Router();

const setupWebSocketServer = (server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");
    const userType = url.searchParams.get("userType");

    if (!userId || !userType) {
      ws.close(1008, "Missing userId or userType");
      return;
    }

    console.log(`WebSocket connection attempt: ${userId} (${userType})`);

    handleWebSocketConnection(ws, {
      query: { userId, userType },
    });
  });

  // console.log("WebSocket server running on /ws");
  console.log(chalk.green(`WebSocket server running on /ws ${figures.tick}`));

  return wss;
};

// REST endpoint
router.get("/online-users", (req, res) => {
  const onlineUsers = getOnlineUsers();
  res.json({
    status: "1",
    online_users: onlineUsers,
    count: onlineUsers.length,
  });
});

export { setupWebSocketServer };
export default router;
