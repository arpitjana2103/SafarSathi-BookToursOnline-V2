const express = require("express");
const userController = require("../controllers/auth.controller");

const userRouter = express.Router();

userRouter.route("/signup").post(userController.signup);

module.exports = userRouter;
