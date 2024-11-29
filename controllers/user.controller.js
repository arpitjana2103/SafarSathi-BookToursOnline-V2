const User = require("../models/user.model");
const { catchAsyncErrors, AppError } = require("./error.controller");

exports.getAllUsers = catchAsyncErrors(async function (req, res, next) {
    const users = await User.find();

    return res.status(200).json({
        status: "success",
        data: {
            users: users,
        },
    });
});

exports.updateMe = catchAsyncErrors(async function (req, res, next) {
    // [1] Create error if user trying to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError("This route is not for updating password", 400),
        );
    }
    // [2] Update user document
    const filteredReqBody = {};
    if (req.body.email) filteredReqBody.email = req.body.email;
    if (req.body.name) filteredReqBody.name = req.body.name;

    const user = await User.findByIdAndUpdate(req.user.id, filteredReqBody, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        status: "success",
        data: {
            user: user,
        },
    });
});

exports.deleteMe = catchAsyncErrors(async function (req, res, next) {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(204).json({
        status: "success",
        data: null,
    });
});
