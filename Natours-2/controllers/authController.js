const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
// const { decode } = require("punycode");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  // remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //   1) check if email and password exist
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  //   2) check if user exist and password is correct
  const user = await User.findOne({ email: email }).select("+password");
  //   const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  //   3) if everything ok,send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1)getting token and check of it's exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError("you are not logedIn and please login to get access", 401)
    );
  }
  // 2)Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3)Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user doesnot exist", 401));
  }
  // 4)Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed password! Please login again", 401)
    );
  }
  // Grant Acess to protected user
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin',"lead-guide"].role="user"
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you dont have permission to perfoem action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based POSTed email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("noe user found with this email address", 404));
  }
  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send it tp users email

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `forgot your password? submit a PATCH request with your new password and confirm password to: ${resetURL}.\nIf you don't forgot your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token (only valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("there is an error in sending email", 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on user
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if token is not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // update changedPasswordAt for the user
  createSendToken(user, 200, res);
  // log in the user in , send JWT
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) User from the collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) check if the posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("your current password is wrong", 401));
  }
  // 3) if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 3) log user in and send jwt
  createSendToken(user, 200, res);
});
