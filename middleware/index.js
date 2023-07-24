const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

function authToken(req, res, next) {
  if (
    !req.body.token &&
    !req.query.token &&
    !req.headers["x-access-token"] &&
    !req.headers["authorization"]
  ) {
    return res.status(404).json({
      status: false,
      message: "User not authenticated",
    });
  }

  const authHeader = req.headers["authorization"];

  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      status: false,
      message: "A token is required for authentication",
    });
  }
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = user;
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Invalid Token",
    });
  }
  return next();
}

async function isCreator(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user.userType === "creator") {
      return next();
    } else {
      return res.status(401).json({
        status: false,
        message: "You are not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

async function created(req, res, next) {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      creator: req.user.id,
    });
    if (post) {
      return next();
    } else {
      return res.status(401).json({
        status: false,
        message: "You are not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

async function passwordCheck(req, res, next) {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (await bcrypt.compare(password, user.password)) {
      return next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user.userType === "admin") {
      return next();
    } else {
      return res.status(401).json({
        status: false,
        message: "You are not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

module.exports = {
  authToken,
  isCreator,
  created,
  passwordCheck,
  isAdmin,
};
