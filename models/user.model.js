const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
        required: [true, "User must have a password"],
        validate: {
            validator: validatePassword,
            message:
                "Password must be 5 to 20 characters and includes uppercase, lowercase & number.",
        },
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (passwordConfirm) {
                return this.password === passwordConfirm;
            },
            message: "Password and PasswordConfirm need to be same",
        },
    },
});

////////////////////////////////////////
// DOCUMENT MEDDLEWARE / HOOK //////////

// runs before Model.prototype.save() and Model.create()
userSchema.pre("save", async function (next) {
    // Only Run the Function if the password is modified
    if (!this.isModified("password")) return next();

    // Hash Password
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

// runs after Model.prototype.save() and Model.create()
userSchema.post("save", function (doc, next) {
    doc.password = undefined;
    doc.__v = undefined;
    next();
});

////////////////////////////////////////
// Instance Method /////////////////////
// These Methods will be availabe for all the Documents

userSchema.methods.varifyPassword = async function (
    rawPassord,
    hashedPassword,
) {
    return await bcrypt.compare(rawPassord, hashedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
