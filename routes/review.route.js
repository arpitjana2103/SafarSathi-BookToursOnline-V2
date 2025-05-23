const express = require("express");
const reviewController = require("./../controllers/review.controller");
const authController = require("./../controllers/auth.controller");

const reviewRouter = express.Router();

reviewRouter
    .route("/")
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo("user"),
        reviewController.createReview,
    );

module.exports = reviewRouter;
