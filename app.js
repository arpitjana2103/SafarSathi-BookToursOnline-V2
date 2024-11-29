const express = require("express");
const morgan = require("morgan");

const { AppError } = require("./controllers/error.controller");
const { globalErrorHandeller } = require("./controllers/error.controller");
const tourRouter = require("./routes/tour.route");
const userRouter = require("./routes/user.route");
const rateLimit = require("express-rate-limit");

const app = express();

// Middleware: Parses incoming JSON requests into JavaScript objects.
app.use(express.json());

// HTTP Request Logger Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Using RateLimiter
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    standardHeaders: "draft-7",
    message: "Too many requests from this IP, please try again in an hour !",
});
app.use("/api", limiter);

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
