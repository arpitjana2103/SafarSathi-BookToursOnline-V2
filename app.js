const express = require("express");
const morgan = require("morgan");

const { tourRouter } = require("./routes/tour.route");
const { userRouter } = require("./routes/user.route");

const app = express();

// Middleware : Convert request into JSON
app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handelling Unhandelled Routes
app.all("*", function (req, res, next) {
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

module.exports = app;
