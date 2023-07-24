const Tier = require("../models/tier");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { hideChars, getAverageRating } = require("../utils/helpers");
dotenv.config();

const createTier = async (req, res) => {
  try {
    const result = await Tier.create({ creator: req.user.id, ...req.body });
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { membership: result._id } },
      { new: true }
    );
    return res.status(201).json({
      status: true,
      message: "Tier created successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to create tier. Please try again. \n Error: ${err}`,
    });
  }
};

const getTiers = async (req, res) => {
  try {
    const tiers = await Tier.find({ creator: req.user.id });

    return res.status(201).json({
      status: true,
      message: "Tiers fetched successfully",
      data: tiers,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to get tiers. Please try again. \n Error: ${err}`,
    });
  }
};

const editTier = async (req, res) => {
  try {
    const { price, description } = req.body;

    const tier = await Tier.findByIdAndUpdate(req.params.tierId, {
      price,
      description,
    });

    return res.status(201).json({
      status: true,
      message: "Tier edited successfully",
      data: tier,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to edit tier. Please try again. \n Error: ${err}`,
    });
  }
};

const deleteTier = async (req, res) => {
  try {
    await Tier.findByIdAndDelete(req.params.tierId);

    return res.status(201).json({
      status: true,
      message: "Tier deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to delete tier. Please try again. \n Error: ${err}`,
    });
  }
};

module.exports = {
  createTier,
  getTiers,
  editTier,
  deleteTier,
};
