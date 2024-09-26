const express = require("express");
const morgan = require("morgan");

const { tourRouter } = require("./routes/tourRouter");
const { userRouter } = require("./routes/userRouter");

const app = express();

// Middleware : Convert request into JSON
app.use(express.json());
app.use(function (req, res, next) {
    console.log("Hello from the middleware..");
    next();
});
app.use(morgan("dev"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

const port = 3000;
app.listen(port, function () {
    console.log(`API URL : http://127.0.0.1:${port}/`);
});
