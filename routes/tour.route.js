const express = require("express");
const tourController = require("../controllers/tour.controller");

const tourRouter = express.Router();

tourRouter
    .route("/")
    .post(tourController.createTour)
    .get(tourController.getAllTours);

tourRouter
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour);

module.exports = { tourRouter };
