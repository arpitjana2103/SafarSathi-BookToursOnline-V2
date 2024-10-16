const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const { catchAsyncErrors, AppError } = require("./error.controller");
const sendEmail = require("../utils/email.util");
const Helper = require("../utils/helper.util");

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
    // [1] Get user based on POSTed Email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("No user found", 404));
    }

    // [2] Generate Random Reset Token
    const resetToken = await user.createPasswordResetToken();

    // [3] Update User
    user.passwordResetToken = await bcrypt.hash(resetToken, 1);
    user.passwordResetTokenExpires =
        Date.now() + Helper.convertToMilliseconds({ minutes: 10 });
    await user.save({ validateBeforeSave: false });

    // [4] Send Token to User-Email
    const baseURL = `${req.protocol}://${req.get("host")}`;
    const passwordResetURL = `${baseURL}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Dear ${user.name},\n\nWe received a request to reset your password.\nIf this was you, please follow the instructions below:\n\nSubmit a - PATCH - request to the following URL:\n"${passwordResetURL}"\n\nRequest Body: \n{\n  "password": "<new-password>",\n  "passwordConfirm": "<new-password>",\n  "email": "${user.email}"\n}\n\nNote: This link will be valid for next 10 minutes\nIf you did not request a password reset, you can safely ignore this email.\n\nThanks,\nThe SafarSathi Team`;

    try {
        await sendEmail({
            email: user.email,
            subject: "SararSathi : Reset Password Instructions",
            message: message,
        });

        return res.status(200).json({
            status: "success",
            message:
                "Password reset instructions have been sent to your registered email.",
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        next(new AppError("There was an error in Sending Email", 500));
    }
});

exports.resetPassword = catchAsyncErrors(async function (req, res, next) {
    // [1] Get User base on Email
    const { email } = req.body;
    const user = await User.findOne({
        email: email,
    });
    if (!user) {
        return next(
            new AppError("No user found with the email-address provided."),
        );
    }

    // [3] Check if Token Invalid
    const rawToken = req.params.token;
    const hashedToken = user.passwordResetToken || "";
    const isTokenInvalid = !(await user.varifyToken(rawToken, hashedToken));
    if (isTokenInvalid) {
        return next(new AppError("Invalid Password-Reset-Link !", 400));
    }

    // [4] Check if Token Expired
    const resetTokenExpiredAt = user.passwordResetTokenExpires.getTime();
    if (resetTokenExpiredAt < Date.now()) {
        return next(new AppError("Password-Reset-Link expired !", 400));
    }

    // [2] Set new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    // [3] Log the user in, send JWT
    const jwt = signToken(user._id);
    return res.status(200).json({
        status: "success",
        token: jwt,
    });
});

exports.updatePassword = catchAsyncErrors(async function (req, res, next) {
    // [1] Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // [2] Check if POSTed passowrd is correct
    if (!(await user.varifyPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError("Your current password is wrong.", 401));
    }

    // [3] Update the Password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // [4] Log in User and send JWT
    const jwt = signToken(user._id);
    return res.status(200).json({
        status: "success",
        token: jwt,
    });
});
