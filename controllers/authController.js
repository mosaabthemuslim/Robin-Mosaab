const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
////////////////////
// create the token
const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

///////////////////
const sendUser = (res, statusCode, user) => {
  // send the user with the response and token
  const token = createJWT(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if ((process.env.NODE_ENV = "production")) cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // not showing the user password
  user.password = undefined;
  res.status(statusCode).json({
    status: "seccess",
    user,
    token,
  });
};
////////////
exports.signup = catchAsync(async (req, res, next) => {
  // create the user from the requist body
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendUser(res, 200, user);
});
// log in user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // find the by the email and then select also the password for later
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("There is no user with that email", 400));
  }
  // compare the hashed password in the DB with the password that is given
  if (!user.comparePasswords(password, user.password)) {
    return next(new AppError("The password is not correct", 400));
  }
  // send the user with the token
  sendUser(res, 200, user);
});
// log out users by setting expires date to now
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    status: "seccess",
  });
});
// protect routes from not sing users
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // req.cookies.jwt
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not loged in please log in to get access")
    );
  }
  // varify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // find current user
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("No user with that token", 400));
  }
  if (currentUser.checkIfPasswordChanged(decoded.iat)) {
    return next(new AppError("The user Changed password log in again", 400));
  }

  // assigning current user to req.user
  req.user = currentUser;
  next();
});
// update user info
exports.updateMe = catchAsync(async (req, res, next) => {
  // find the user
  const user = await User.findOne(req.user._id).select("-password");
  if (!user)
    return next(
      new AppError(
        "You are not log in Please log in to update your information"
      ),
      400
    );
  if (req.body.password)
    return next(
      new AppError("Please go to /updatePassword to update password"),
      400
    );
  const { name, email } = req.body;
  user.name = name;
  user.email = email;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "seccess",
    user,
  });
});
// update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // find the user plus its password
  const user = await User.findOne(req.body._id).select("+password");
  if (!user)
    return next(
      new AppError(
        "You are not log in Please log in to update your information"
      ),
      404
    );
  // compare passwords
  if (!user.comparePasswords(req.body.currentPassword, user.password)) {
    return next(new AppError("The password is not correct", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  sendUser(res, 200, user);
});

exports.fotgotPassword = catchAsync(async (req, res, next) => {
  // find the user by its email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("there is no user with this email"), 400);
  ////createResetToken
  const token = user.createResetToken();
  await user.save({ validateBeforeSave: false });
  const URL = `127.0.0.1:3000/robin/user/v1/resetPassword/${token}`;
  const text = `You requist was accepte go to this URL to reset you account password.\n${URL}.\n Valid for 10 min`;
  const options = {
    from: "Mosaab",
    to: user.email,
    subject: "Your reset token",
    text,
  };
  try {
    sendEmail(options);
    res.status(200).json({
      status: "seccess",
      message: "Your Token was send seccessflly",
    });
  } catch (err) {
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Somthing whent wrong"), 500);
  }
});
// using the reset token to reset the password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // find the user by the token and the expires date of reset token
  const user = await User.findOne({
    resetToken: hashedToken,
    resetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("This token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();
  sendUser(res, 200, user);
});
// making the user not active
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: req.body.active,
  });
  await user.save();
  res.cookie("jwt", "delete account", { expires: new Date(Date.now()) });
  res.status(200).json({
    status: "seccess",
  });
});
