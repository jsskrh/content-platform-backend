const express = require("express");
const router = express.Router();

const Users = require("../controllers/users");

const auth = require("../middleware/index");

router.post("/register", Users.createUser);
router.post("/login", Users.loginUser);
// router.get("/profile", auth.authToken, Users.getUser);

module.exports = router;
