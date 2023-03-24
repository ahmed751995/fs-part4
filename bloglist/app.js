const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogRoutes = require("./controllers/blogs");
const morgan = require("morgan");
require("express-async-errors");
const app = express();
require("dotenv").config();

const url = config.MONGODB_URL;

logger.info("connecting to ", url);

mongoose
  .connect(url)
  .then((result) => logger.info("connection done successfully"))
  .catch((error) => logger.error("error : ", error.message));

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(middleware.requistLogger);
}
app.use(morgan("tiny"));
app.use("/api/blogs", blogRoutes);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
