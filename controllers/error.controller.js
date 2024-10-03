const sendErrForDev = function (err, res) {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrForProd = function (err, res) {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Unknown Error Handelling in Production
    console.error(err);
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
