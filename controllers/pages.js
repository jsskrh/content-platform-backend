const Page = require("../models/page");
const dotenv = require("dotenv");
const { hideChars, getAverageRating } = require("../utils/helpers");
dotenv.config();

const createPage = async (req, res) => {
  try {
    const result = await Page.create(req.body);
    return res.status(201).json({
      status: true,
      message: "Page created successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to create page. Please try again. \n Error: ${err}`,
    });
  }
};

const updatePage = async (req, res) => {
  const {
    isDeactivated,
    rating,
    balance,
    creator,
    isDisabled,

    ...updateObject
  } = req.body;

  if (isDeactivated || rating || balance || creator || isDisabled) {
    return res.status(401).json({
      status: false,
      message: "You are not authorized to do that.",
    });
  }

  try {
    const page = await Page.findByOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      req.body
    );

    if (page == null) {
      return res.status(401).json({
        status: false,
        message: "Not authorized.",
      });
    }

    if (page.isDeactivated) {
      return res.status(401).json({
        status: false,
        message: "Page has been deactivated.",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Page updated successfully",
      data: page,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    return res.status(201).json({
      status: true,
      message: "Page fetched successfully",
      data: page,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getPages = async (req, res) => {
  try {
    const pages = await Page.find({ user: req.user.id });

    return res.status(201).json({
      status: true,
      message: "Pages fetched successfully",
      data: pages,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deactivatePage = async (req, res) => {
  try {
    await Page.findByIdAndUpdate(req.page.id, { isDeactivated: true });

    return res.status(201).json({
      status: true,
      message: "Page successfully deactivated",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPage,
  updatePage,
  getPage,
  getPages,
};
