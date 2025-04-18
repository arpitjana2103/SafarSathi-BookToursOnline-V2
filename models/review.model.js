const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            require: [true, "Review can not be empty"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: "Tour",
            required: [true, "Review must belongs to a Tour"],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

reviewSchema.post("save", function (doc, next) {
    doc.__v = undefined;
    next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
