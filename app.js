const express = require("express");
const morgan = require("morgan");

const { tourRouter } = require("./routes/tour.route");
const { userRouter } = require("./routes/user.route");

const app = express();

// Middleware : Convert request into JSON
app.use(express.json());
app.use(function (req, res, next) {
    console.log("Hello from the middleware..");
    next();
});

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = { app };
