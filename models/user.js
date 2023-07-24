const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
    },
    userType: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    balance: {
      type: mongoose.Decimal128,
      // required: true,
      default: 0.0,
    },
    avatar: {
      type: String,
    },
    description: {
      videoUrl: { type: String },
      bio: {
        type: String,
      },
    },
    membership: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tier" }],
    // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    // notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    userBank: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    isDisabled: {
      type: Boolean,
      deafult: false,
    },
    isDeactivated: {
      type: Boolean,
      deafult: false,
    },
    token: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
