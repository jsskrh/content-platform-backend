const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

const uri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/content_platform_app";

mongoose.set("strictQuery", false);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to Database.");
  })
  .catch((err) => {
    console.log("Unable to connect to Database.", err);
  });

app.use("/api/user", userRoutes);

module.exports = app;
