require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users");
const cardsRoutes = require("./routes/cards");

const logger = require("./middlewares/logger");


const generateInitialData = require("./utils/initialData");
const app = express();
app.use(express.json());

app.use(morgan("dev")); 

app.use(cors());       

const DB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.ATLAS_DB
    : process.env.LOCAL_DB;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log(chalk.blueBright("MongoDB connected"));
    generateInitialData(); 
  })
  .catch((err) =>
    console.error(chalk.red("MongoDB connection error:", err))
  );

app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);

app.use(logger);
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
  console.log(chalk.greenBright(`SANDBOX-SERVER http://localhost:${PORT}`));
});
