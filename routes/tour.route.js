const express = require("express");
const tourController = require("../controllers/tour.controller");

const tourRouter = express.Router();

// Param Middleware

tourRouter.param("id", function (req, res, next, val) {
    console.log(val);
    next();
});

tourRouter
    .route("/")
    .get(tourController.getAllTour)
    .post(tourController.createTour);

tourRouter
    .route("/:id")
    .get(tourController.getTour)
    .post(tourController.updateTour);

module.exports = { tourRouter };
