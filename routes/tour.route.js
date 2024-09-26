const express = require("express");
const tourController = require("../controller/tour.controller");

const tourRouter = express.Router();

tourRouter
    .route("/")
    .get(tourController.getAllTour)
    .post(tourController.createTour);

tourRouter
    .route("/:id")
    .get(tourController.getTour)
    .post(tourController.updateTour);

module.exports = { tourRouter };
