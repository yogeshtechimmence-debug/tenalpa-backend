import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MongoDb from "./util/db.js";
import chalk from "chalk";
import figures from "figures";
import router from "./router/AllRoutes/AllRoutes.js";

dotenv.config();
const app = express();

app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
MongoDb();

app.use("/tenalpa/api", router);

app.listen(process.env.PORT, () => {
   console.log(chalk.green(`Server Started ${figures.tick}`));
});
