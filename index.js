import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MongoDb from "./util/db.js";
import chalk from "chalk";
import figures from "figures";
import path from "path";
import router from "./router/AllRoutes/AllRoutes.js";
import http from "http";
import websocketRoute, { setupWebSocketServer } from "./router/WebSocketRoutes.js";
import adminRoute from './Admin/Routes/AdminRoutes.js';


dotenv.config();
const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/tenalpa/api", router);
app.use("/tenalpa/admin", adminRoute); 
app.use("/tenalpa/api", websocketRoute); 


// DB connection
MongoDb();

const server = http.createServer(app);

setupWebSocketServer(server);

const PORT = process.env.PORT
server.listen(PORT, () => {
  console.log(chalk.green(`Server running on port ${PORT} ${figures.tick}`));
});
