import mongoose from "mongoose";
import chalk from "chalk";
import figures from "figures";

const MongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green(`Database Connected ${figures.tick}`));
  } catch (err) {
    console.log(chalk.red("✖ Database Connection Failed"));
    console.error(err.message);
  }
};

export default MongoDb;
