const express = require("express");
const tourController = require("../controllers/tour.controller");

const tourRouter = express.Router();

tourRouter.route("/").post(tourController.createTour);

module.exports = { tourRouter };
