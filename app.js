const express = require("express");
const morgan = require("morgan");
const fs = require("fs");

const app = express();

// Middleware : Convert request into JSON
app.use(express.json());
app.use(function (req, res, next) {
    console.log("Hello from the middleware..");
    next();
});
app.use(morgan("dev"));

const filePath = `${__dirname}/dev-data/data/tours-simple.json`;
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

const getAllUsers = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const getUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const createUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const updateUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const deleteUser = function (req, res) {
    return res.status(500).json({
        status: "error",
        message: "This route is not yet defined!",
    });
};

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTour).post(createTour);
tourRouter.route("/:id").get(getTour).post(updateTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

const port = 3000;
app.listen(port, function () {
    console.log(`API URL : http://127.0.0.1:${port}/`);
});
