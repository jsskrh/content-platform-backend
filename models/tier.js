const mongoose = require("mongoose");

const tierSchema = new mongoose.Schema(
  {
    price: { type: mongoose.Decimal128, required: true },
    description: { type: String, required: true },
    subscribers: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Tier = mongoose.model("Tier", tierSchema);
module.exports = Tier;
