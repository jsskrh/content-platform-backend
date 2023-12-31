const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { hideChars, getAverageRating } = require("../utils/helpers");
dotenv.config();

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      // address,
      userType,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      // !address ||
      !userType
    ) {
      return res.status(400).json({
        status: false,
        message: "Fill the in your details",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        status: false,
        message: "User already exists with email",
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      // address,
      userType,
      password: hashedPassword,
    });
    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to create user. Please try again. \n Error: ${err}`,
    });
  }
};

const loginUser = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({
      status: false,
      message: "Email and password required",
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user == null) {
    return res.status(401).json({
      status: false,
      message: "User does not exist.",
    });
  }

  if (user.isDeactivated) {
    return res.status(401).json({
      status: false,
      message: "Account has been deactivated.",
    });
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN);
      const userData = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        bio: user.bio,
        userToken: accessToken,
        phoneNumber: user.phoneNumber,
        country: user.country,
        balance: user.balance,
        avatar: user.avatar,
        bank: user.userBank,
        rating: user.rating,
        accountNumber: user.accountNumber && hideChars(user.accountNumber),
      };
      res.status(200).send(userData);
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      description: user.description,
      phoneNumber: user.phoneNumber,
      country: user.country,
      balance: user.balance,
      avatar: user.avatar,
      bank: user.userBank,
      rating: getAverageRating(user.reviews),
      accountNumber: user.accountNumber && hideChars(user.accountNumber),
    };
    res.status(201).send(userData);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateAvatar = async (req, res) => {
  const { imageUrl } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: imageUrl },
      { new: true }
    );

    return res.status(201).json({
      status: true,
      message: "Page created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server error" });
  }
};

const updateDescription = async (req, res) => {
  const { videoUrl, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { description: { videoUrl, bio } },
      { new: true }
    );

    return res.status(201).json({
      status: true,
      message: "Page created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server error" });
  }
};

const updateUserInfo = async (req, res) => {
  const {
    isDeactivated,
    rating,
    password,
    userType,
    balance,
    reviews,
    notifications,
    isDisabled,

    ...updateObject
  } = req.body;

  if (
    isDeactivated ||
    rating ||
    password ||
    userType ||
    balance ||
    reviews ||
    notifications ||
    isDisabled
  ) {
    return res.status(401).json({
      status: false,
      message: "You are not authorized to do that.",
    });
  }

  const user = await User.findById(req.user.id);

  if (
    updateObject.hasOwnProperty("email") &&
    updateObject.email !== user.email
  ) {
    const newEmail = updateObject.email;
    if (await User.findOne({ email: newEmail })) {
      return res.status(409).json({
        status: false,
        message: "User already exists with email",
      });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(req.user.id, updateObject, {
      new: true,
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      country: user.country,
      balance: user.balance,
      avatar: user.avatar,
      bank: user.userBank,
      rating: user.rating,
      accountNumber: user.accountNumber && hideChars(user.accountNumber),
    };

    res.status(201).send(userData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server error" });
  }
};

const updatePaymentInfo = async (req, res) => {
  const { oldAccountNumber, newAccountNumber, bank } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.accountNumber && oldAccountNumber !== user.accountNumber) {
      return res.status(401).json({
        status: false,
        message: "Incorrect old account number.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { accountNumber: newAccountNumber, userBank: bank },
      { new: true }
    );

    const userData = {
      bank: updatedUser.userBank,
      accountNumber: hideChars(updatedUser.accountNumber),
    };
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const updatePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    return res.status(201).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isDeactivated: true });

    return res.status(201).json({
      status: true,
      message: "User successfully deactivated",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateAvatar,
  updateDescription,
  updateUserInfo,
  updatePaymentInfo,
  updatePassword,
  deactivateAccount,
};
