const express = require("express");
const router = express.Router();

const Posts = require("../controllers/posts");

const auth = require("../middleware/index");

router.post("/", auth.authToken, auth.isCreator, Posts.createPost);
router.get("/", auth.authToken, Posts.getPosts);
router.get("/:postId", auth.authToken, Posts.getPost);
router.delete("/:postId", auth.authToken, auth.created, Posts.deletePost);

module.exports = router;
