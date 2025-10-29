import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MongoDb from "./util/db.js";
import chalk from "chalk";
import figures from "figures";
import path from "path";
import router from "./router/AllRoutes/AllRoutes.js";
import authRouter from "./router/authRoute.js";

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

// DB connection
MongoDb();

app.use("/tenalpa/api", router);
app.use("/tenalpa/api", authRouter);

app.listen(process.env.PORT, () => {
   console.log(chalk.green(`Server Started ${figures.tick}`));
});
