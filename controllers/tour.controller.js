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

exports.getAllTours = async function (req, res) {
    const allTours = await Tour.find();
};
