import express = require("express");
import { AppDataSource } from "./config/data-source";
import logger = require("morgan");
import { StatusCodes } from "http-status-codes";
import cookieParser = require("cookie-parser");
import router from "./routes/index";
const app = express();
app.use(express.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(StatusCodes.NOT_FOUND).json({
    message: "Not Found",
  });
});

// Connect to PostgreSQL
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => console.log("Database connection failed:", error));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
