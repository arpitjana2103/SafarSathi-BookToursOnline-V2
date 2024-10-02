const { Tour } = require("../models/tour.model");
const APIFeatures = require("../utils/apiFeatures.util");

exports.createTour = async function (req, res) {
    try {
        const newTour = await Tour.create(req.body);
        return res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            error: error,
        });
    }
};

exports.getAllTours = async function (req, res) {
    try {
        const query = Tour.find();
        const features = new APIFeatures(query, req.query);
        const tours = await features.filter().sort().limit().paginate().query;

        return res.status(200).json({
            status: "success",
            count: tours.length,
            data: { tours: tours },
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            status: "fail",
            error: error,
        });
    }
};

exports.aliasTop5Cheap = async function (req, res, next) {
    req.query = {
        ...req.query,
        limit: "5",
        sort: "-ratingsAverage,price",
        fields: "name,price,ratingsAverage,summery,difficulty",
    };
    next();
};

exports.getTour = async function (req, res) {
    try {
        const { id } = req.params;
        const tour = await Tour.findById(id);

        return res.status(200).json({
            status: "success",
            tour: tour,
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            error: error,
        });
    }
};

exports.updateTour = async function (req, res) {
    try {
        const { id } = req.params;
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({
            status: "success",
            tour: tour,
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            error: error,
        });
    }
};

exports.deleteTour = async function (req, res) {
    try {
        const { id } = req.params;
        await Tour.findByIdAndDelete(id);

        return res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            error: error,
        });
    }
};
