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

const generateSortedBy = function (sortedBy) {
    if (!sortedBy) return "-createdAt";
    return sortedBy.replace(/,/g, " ");
};

const generateFields = function (fields) {
    if (!fields) return "-__v";
    return fields.replace(/,/g, " ");
};

exports.getAllTours = async function (req, res) {
    try {
        // 1. Filtering
        const filterObj = processReqQuery({ ...req.query });
        let query = Tour.find(filterObj);

        // 2. Sorting
        const sortedBy = generateSortedBy(req.query.sort);
        query = query.sort(sortedBy);

        // 3. Limit Fields
        const fields = generateFields(req.query.fields);
        query = query.select(fields);

        const tours = await query;

        return res.status(200).json({
            status: "success",
            count: tours.length,
            data: { tours: tours },
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
