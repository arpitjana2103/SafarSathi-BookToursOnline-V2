const AppError = require("../utils/AppError");

const sendErrForDev = function (err, res) {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const handleCastErrorDB = function (err) {
    if (err.name === "CastError") {
        const message = `Invalid >> ${err.path} = "${err.value}"`;
        return new AppError(message, 400);
    }
    return err;
};

const handleDuplicateFieldsDB = function (err) {
    if (err.code === 11000) {
        const message = `Duplicate field value >> ${JSON.stringify(err.keyValue)}`;
        return new AppError(message, 400);
    }
    return err;
};

const handleValidationError = function (err) {
    if (err.name === "ValidationError") {
        const message = err.message;
        return new AppError(message, 400);
    }
    return err;
};

const sendErrForProd = function (err, res) {
    // Handle DB Cast Error
    err = handleCastErrorDB(err);

    // Handle Duplicate Field Value Error
    err = handleDuplicateFieldsDB(err);

    // Handle Validation Error
    err = handleValidationError(err);

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Unknown Error Handelling in Production
    // console.error(err);
    return res.status(500).json({
        status: "error",
        message: "Something went very wrong !",
    });
};

exports.catchAsyncErrors = function (fnc) {
    return function (req, res, next) {
        fnc(req, res, next).catch(next);
    };
};

exports.globalErrorHandeller = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrForDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        sendErrForProd(err, res);
    }
};
