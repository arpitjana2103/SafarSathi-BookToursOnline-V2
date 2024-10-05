const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const { catchAsyncErrors, AppError } = require("./error.controller");

const signToken = function (id) {
    const payload = { id: id };
    const jwtSecretKey = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: jwtExpiresIn });
    return token;
};

exports.signup = catchAsyncErrors(async function (req, res, next) {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    return res.status(200).json({
        status: "success",
        token: token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsyncErrors(async function (req, res, next) {
    const { email, password } = req.body;

    // [1] Check If Email and Password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }

    // [2] Check If User exists and Password is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.varifyPassword(password, user.password))) {
        return next(new AppError("Incorrect Email or Password", 401));
    }

    // [3] If everything ok, send Token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token: token,
    });
});

exports.protect = catchAsyncErrors(async function (req, res, next) {
    // [1] Getting the Token
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
        token = token.split(" ")[1];
    }
    if (!token) {
        return next(new AppError("Please login to get access.", 401));
    }

    // [2] Verify token
    const jwtSecretKey = process.env.JWT_SECRET;
    const decoded = await promisify(jwt.verify)(token, jwtSecretKey);

    // [3] Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError("The User donot exist.", 401));
    }

    // [4] Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(AppError("Password changed! Please log in again!", 401));
    }

    req.user = user;

    next();
});

exports.restrictTo = function (...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403,
                ),
            );
        }
        next();
    };
};

exports.forgetPassword = catchAsyncErrors(async function (req, res, next) {
    // 1) Get user based on POSTed Email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("No user found", 404));
    }

    // 2) Generate Random Reset Token
    const resetToken = await user.createPasswordResetToken();
    user.passwordResetToken = await bcrypt.hash(resetToken, 1);
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // 3) Set it to User Email
    res.status(200).json({
        status: "success",
        message: "OTP will be valid for next 10 minutes",
        otp: resetToken,
    });
});
