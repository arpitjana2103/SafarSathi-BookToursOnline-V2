const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter
    .route("/")
    .get(
        authController.protect,
        authController.restrictTo("admin"),
        userController.getAllUsers,
    );

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);

userRouter.route("/forgetPassword").post(authController.forgetPassword);
userRouter.route("/resetPassword/:token").patch(authController.resetPassword);
userRouter
    .route("/updatePassword")
    .patch(authController.protect, authController.updatePassword);

userRouter
    .route("/updateMe")
    .patch(authController.protect, userController.updateMe);

userRouter
    .route("/deleteme")
    .delete(authController.protect, userController.deleteMe);

module.exports = userRouter;
