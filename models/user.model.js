const mongoose = require("mongoose");
const validator = require("validator");

const validatePassword = function (password) {
    return (
        password.length >= 5 &&
        password.length <= 20 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "User must have a name"],
    },
    email: {
        type: String,
        required: [true, "User must have email"],
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email address",
        },
    },
    photo: String,
    password: {
        type: String,
        required: true,
        validate: {
            validator: validatePassword,
            message:
                "Password must be 5 to 20 characters and includes uppercase, lowercase & number.",
        },
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
