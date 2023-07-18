const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    balance: {
      type: mongoose.Decimal128,
      // required: true,
      default: 0.0,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
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
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;
