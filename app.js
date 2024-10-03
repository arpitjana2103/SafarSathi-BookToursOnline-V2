const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/AppError");
const globalErrorHandeller = require("./controllers/error.controller");
const tourRouter = require("./routes/tour.route");
const userRouter = require("./routes/user.route");

const app = express();

// Middleware: Parses incoming JSON requests into JavaScript objects.
app.use(express.json());

// HTTP Request Logger Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Router Middleware
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handelling Unhandelled Routes
app.all("*", function (req, res, next) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handelling Middleware
app.use(globalErrorHandeller);

module.exports = app;
