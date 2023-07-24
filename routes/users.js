const express = require("express");
const router = express.Router();

const Users = require("../controllers/users");

const auth = require("../middleware/index");

router.post("/register", Users.createUser);
router.post("/login", Users.loginUser);
router.get("/profile", auth.authToken, Users.getUser);
router.put("/profile/avatar", auth.authToken, Users.updateAvatar);
router.put("/profile/description", auth.authToken, Users.updateDescription);

module.exports = router;
