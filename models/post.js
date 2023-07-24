const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
    viewers: {
      type: String,
      default: "public",
      enum: ["public", "patreons", "tier"],
      trim: true,
    },
    tier: {
      type: String,
      trim: true,
    },
    earlyAccess: {
      type: Boolean,
      default: false,
      trim: true,
    },
    textPreview: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
