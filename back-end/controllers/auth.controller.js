const { User } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const { sendEmail } = require("../util/mail");
const generateAccessToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIREIN,
  });
};
const generateRefreshToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIREIN,
  });
};
exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = generateAccessToken(newUser._id, newUser.name);
    console.log(
      process.env.PASS_EMAIL,
      process.env.USER,
      process.env.PORT_EMAIL,
      process.env.HOST
    );

    await sendEmail({
      email: newUser.email,
      sub: "SignUp successfully",
      text: "welcome to our application",
    });
    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "register with another email",
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "you must enter email and password...!!",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    const isValidPass = await user.comparePassword(password);
    // console.log(`${user},${isValidPass}`);

    if (!user || !isValidPass) {
      return res.status(401).json({
        status: "fail",
        message: "wrong email or password...!!",
      });
    }
    const token = generateAccessToken(user._id, user.name);
    const refreshToken = generateRefreshToken(user._id, user.name);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "please try again...",
    });
  }
};
exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;
    // console.log(token);

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "you are not authorized please enter the token ...!!",
      });
    }
    // console.log("token", token);

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = await User.findById(decoded.id);
    // console.log("user", user);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found ...!!",
      });
    }
    if (user.checkChangePassTime(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "token is not valid ...!!",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        status: "fail",
        message: "refresh token is not found ...!!",
      });
    }
    const decoded = await promisify(jwt.verify)(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded.id);
    // console.log("user", user);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found ...!!",
      });
    }
    if (user.checkChangePassTime(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "token is not valid ...!!",
      });
    }
    const token = generateAccessToken(user._id, user.name);
    const newRefreshToken = generateRefreshToken(user._id, user.name);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({
        status: "fail",
        message: "refresh Token is expired please login",
      });
    }
    res.status(403).json({
      status: "fail",
      message: "refresh token is expired or invalid",
    });
  }
};
