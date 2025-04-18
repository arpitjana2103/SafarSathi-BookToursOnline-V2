const Review = require("../models/review.model");
const { catchAsyncErrors } = require("./error.controller");

exports.getAllReviews = catchAsyncErrors(async function (req, res, next) {
    const reviews = await Review.find();
    return res.status(200).json({
        status: "success",
        count: reviews.length,
        data: {
            reviews: reviews,
        },
    });
});

exports.createReview = catchAsyncErrors(async function (req, res, next) {
    req.body.user = req.user._id;
    console.log(req.body);
    const newReview = await Review.create(req.body);
    console.log(newReview);
    return res.status(200).json({
        status: "success",
        data: {
            review: newReview,
        },
    });
});
