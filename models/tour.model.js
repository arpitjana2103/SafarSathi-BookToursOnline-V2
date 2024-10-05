const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "(( A tour must have a name ))"],
            unique: true,
            trim: true,
            maxLength: [
                40,
                "(( A tour name must have less or equel then 40 characters ))",
            ],
            minLength: [
                10,
                "(( A tour name must have greater or equel then 10 characters ))",
            ],
        },
        slug: {
            type: String,
        },
        duration: {
            type: Number,
            require: [true, "(( A tour nust have a duration ))"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "(( A tour must hava a size ))"],
        },
        difficulty: {
            type: String,
            required: [true, "(( A tour must have a difficulty ))"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "(( Difficulty is either : easy, medium, difficult ))",
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "(( Rating must be above or equels 1.0 ))"],
            max: [5, "(( Rating must be below or equels 5 ))"],
        },
        ratingsQuatity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "(( A tour must have a price ))"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                // Will not work while update..
                // Only work while creating new Docs..
                validator: function (discount) {
                    return this.price > discount;
                },
                message: "(( Discount price : #{VALUE} should be below price ))",
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "(( A tour must have a summary ))"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "(( A tour must have a cover image ))"],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

////////////////////////////////////////
// Virtual Fields //////////////////////

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

////////////////////////////////////////
// DOCUMENT MEDDLEWARE / HOOK //////////

// runs before Model.prototype.save() and Model.create()
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// runs after Model.prototype.save() and Model.create()
tourSchema.post("save", function (doc, next) {
    doc.__v = undefined;
    next();
});

////////////////////////////////////////
// QUERY MIDDLEWARE / HOOK /////////////

// runs before Model.find() but not for findOne()
// Using regX /^find/ to work it for
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

// runs after Model.find() but not for findOne()
tourSchema.post(/^find/, function (docs, next) {
    // console.log(docs);
    // console.log(`Query took : ${Date.now() - this.start} milliseconds.`);
    next();
});

////////////////////////////////////////
// AGGREGATION MIDDLEWARE / HOOK ///////

tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    // console.log(this.pipeline());
    next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
