const express = require("express");

const getAllUsers = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const getUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const createUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const updateUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const deleteUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = { userRouter };
