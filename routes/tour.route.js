const express = require("express");
const tourController = require("../controllers/tour.controller");
const authController = require("../controllers/auth.controller");

const tourRouter = express.Router();

tourRouter.route("/stats").get(tourController.getTourStats);
tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
    .route("/top-5-cheap")
    .get(tourController.aliasTop5Cheap, tourController.getAllTours);

tourRouter
    .route("/")
    .post(authController.restrictTo("admin"), tourController.createTour)
    .get(tourController.getAllTours);

tourRouter
    .route("/:id")
    .get(tourController.getTour)
    .patch(
        authController.restrictTo("admin", "lead-guide"),
        tourController.updateTour,
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour,
    );

module.exports = tourRouter;
