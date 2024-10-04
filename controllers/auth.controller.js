const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
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

    // 1) Check If Email and Password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }

    // 2) Check If User exists and Password is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.varifyPassword(password, user.password))) {
        return next(new AppError("Incorrect Email or Password", 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token: token,
    });
});
