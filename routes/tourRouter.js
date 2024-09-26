const express = require("express");
const fs = require("fs");

console.log(__dirname);

const tourRouter = express.Router();
const filePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const toursDataTxt = fs.readFileSync(filePath, "utf-8");
const toursData = JSON.parse(toursDataTxt);

const getAllTour = function (req, res) {
    return res.status(200).json({
        status: "Success",
        results: toursData.length,
        data: {
            tours: toursData,
        },
    });
};

const getTour = function (req, res) {
    const id = Number(req.params.tourId);

    const tour = toursData.find(function (el) {
        return el.id === id;
    });

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    return res.status(200).json({
        status: "Success",
        results: toursData.length,
        data: {
            tour: tour,
        },
    });
};

const createTour = function (req, res) {
    const newId = toursData[toursData.length - 1].id + 1;
    const newTour = { ...req.body, id: newId };

    toursData.push(newTour);
    fs.writeFile(filePath, JSON.stringify(toursData), function (error) {
        res.status(201).json({
            status: "Success",
            data: {
                tour: newTour,
            },
        });
    });
};

const updateTour = function (req, res) {
    return res.status(200).json({
        status: "Success",
        data: {
            tour: "<Updated Tour Here>",
        },
    });
};

tourRouter.route("/").get(getAllTour).post(createTour);
tourRouter.route("/:id").get(getTour).post(updateTour);

module.exports = { tourRouter };
