const fs = require("fs");

const filePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const toursDataTxt = fs.readFileSync(filePath, "utf-8");
const toursData = JSON.parse(toursDataTxt);

exports.getAllTour = function (req, res) {
    return res.status(200).json({
        status: "Success",
        results: toursData.length,
        data: {
            tours: toursData,
        },
    });
};

exports.getTour = function (req, res) {
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

exports.createTour = function (req, res) {
    const newId = toursData[toursData.length - 1].id + 1;
    const newTour = { ...req.body, id: newId };

    toursData.push(newTour);
    fs.writeFile(filePath, JSON.stringify(toursData), function () {
        res.status(201).json({
            status: "Success",
            data: {
                tour: newTour,
            },
        });
    });
};

exports.updateTour = function (req, res) {
    return res.status(200).json({
        status: "Success",
        data: {
            tour: "<Updated Tour Here>",
        },
    });
};
