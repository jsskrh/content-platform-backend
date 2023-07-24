const Post = require("../models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { hideChars, getAverageRating } = require("../utils/helpers");
dotenv.config();

const createPost = async (req, res) => {
  try {
    const result = await Post.create({ creator: req.user.id, ...req.body });
    return res.status(201).json({
      status: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to create post. Please try again. \n Error: ${err}`,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ creator: req.user.id });

    return res.status(201).json({
      status: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to get posts. Please try again. \n Error: ${err}`,
    });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    return res.status(201).json({
      status: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to get post. Please try again. \n Error: ${err}`,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);

    return res.status(201).json({
      status: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to delete post. Please try again. \n Error: ${err}`,
    });
  }
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  deletePost,
};
