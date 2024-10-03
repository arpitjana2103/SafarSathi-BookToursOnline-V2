const globalErrorHandeller = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const catchAsyncErrors = function (fnc) {
    return function (req, res, next) {
        fnc(req, res, next).catch(next);
    };
};

module.exports = { globalErrorHandeller, catchAsyncErrors };
