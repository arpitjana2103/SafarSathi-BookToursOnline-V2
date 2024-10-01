const { Tour } = require("../models/tour.model");

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

const processReqQuery = function (queryObj) {
    // 1. Exclude prohibited fields
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // 2. Add '$' into comparison operators
    let queryStr = JSON.stringify(queryObj);
    const operators = ["gt", "gte", "lt", "lte"];
    operators.forEach(function (operator) {
        const regex = new RegExp(`(${operator})\\b`, "g");
        queryStr = queryStr.replace(regex, `$${operator}`);
    });
    queryObj = JSON.parse(queryStr);

    return queryObj;
};

const generageSortedBy = function (sortedBy) {
    if (!sortedBy) return "-createdAt";
    return sortedBy.replace(/,/g, " ");
};

exports.getAllTours = async function (req, res) {
    try {
        // 1. Filtering
        const filterObj = processReqQuery({ ...req.query });
        let query = Tour.find(filterObj);

        // 2. Sorting
        const sortedBy = generageSortedBy(req.query.sort);
        query = query.sort(sortedBy);

        const allTours = await query;

        return res.status(200).json({
            status: "success",
            data: {
                tours: allTours,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            error: error,
        });
    }
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
