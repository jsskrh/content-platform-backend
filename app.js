const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const creatorPageRoutes = require("./routes/page");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

const uri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/content-platform-app";

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/user", userRoutes);
app.use("/api/creator/pages", creatorPageRoutes);

module.exports = app;
