import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MongoDb from "./util/db.js";
import chalk from "chalk";
import figures from "figures";
import authRoutes from "./router/AuthRoutes.js";

dotenv.config();
const app = express();

app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
MongoDb();

// auth Routes
app.use("/tenalpa/api/auth", authRoutes);


app.listen(3000, () => {
   console.log(chalk.green(`Server Started ${figures.tick}`));
});
