const { Tour } = require("../models/tour.model");
const { catchAsyncErrors } = require("./error.controller");
const QueryFeatures = require("../utils/QueryFeatures");

exports.createTour = catchAsyncErrors(async function (req, res) {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
        status: "success",
        data: {
            tour: newTour,
        },
    });
});

exports.getAllTours = catchAsyncErrors(async function (req, res) {
    const mongooseQuery = Tour.find();
    const queryFeatures = new QueryFeatures(mongooseQuery, req.query);
    const tourQuery = queryFeatures
        .filter()
        .sort()
        .limitFields()
        .paginate().mongooseQuery;

    const tours = await tourQuery;

    return res.status(200).json({
        status: "success",
        count: tours.length,
        data: { tours: tours },
    });
});

exports.aliasTop5Cheap = catchAsyncErrors(async function (req, res, next) {
    req.query = Object.assign(req.query, {
        limit: "5",
        sort: "price,-ratingsAverage",
        fields: "name,price,ratingsAverage,summery,difficulty,duration",
    });
    next();
});

exports.getTourStats = catchAsyncErrors(async function (req, res) {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 },
            },
        },
        {
            $group: {
                _id: "$difficulty",
                tourCount: { $sum: 1 },
                ratingsCount: { $sum: "$ratingsQuantity" },
                ratingAvg: { $avg: "$ratingsAverage" },
                priceAvg: { $avg: "$price" },
                priceMax: { $max: "$price" },
                priceMin: { $min: "$price" },
            },
        },
        {
            $addFields: {
                _difficulty: { $toUpper: "$_id" },
            },
        },
        {
            $unset: ["_id"],
        },
    ]);

    return res.status(200).json({
        status: "success",
        stats: stats,
    });
});

exports.getMonthlyPlan = catchAsyncErrors(async function (req, res) {
    const { year } = req.params;
    const plan = await Tour.aggregate([
        {
            $unwind: "$startDates",
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                tourStartsCount: { $sum: 1 },
                tours: { $push: "$name" },
            },
        },
        {
            $addFields: {
                month: "$_id",
            },
        },
        {
            $unset: ["_id"],
        },
        {
            $sort: { tourStartsCount: -1 },
        },
    ]);

    return res.status(200).json({
        status: "success",
        info: 'month "1" is month "January"',
        plan: plan,
    });
});

exports.getTour = catchAsyncErrors(async function (req, res) {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    return res.status(200).json({
        status: "success",
        tour: tour,
    });
});

exports.updateTour = catchAsyncErrors(async function (req, res) {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    return res.status(200).json({
        status: "success",
        tour: tour,
    });
});

exports.deleteTour = catchAsyncErrors(async function (req, res) {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);

    return res.status(204).json({
        status: "success",
        data: null,
    });
});
