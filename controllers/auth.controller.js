const User = require("../models/user.model");
const { catchAsyncErrors } = require("./error.controller");

exports.signup = catchAsyncErrors(async function (req, res, next) {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    return res.status(200).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});
