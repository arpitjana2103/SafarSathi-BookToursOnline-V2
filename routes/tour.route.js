const express = require("express");
const tourController = require("../controllers/tour.controller");

const tourRouter = express.Router();

tourRouter
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter
    .route("/")
    .post(tourController.createTour)
    .get(tourController.getAllTours);

tourRouter
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = { tourRouter };
