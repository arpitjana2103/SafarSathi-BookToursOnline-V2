const User = require("../models/user.model");
const { catchAsyncErrors } = require("./error.controller");

exports.signup = catchAsyncErrors(async function (req, res, next) {
    const newUser = await User.create(req.body);

    return res.status(200).json({
        status: "success",
        data: {
            user: newUser,
        },
    });
});
