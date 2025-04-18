exports.AppError = class extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
    }
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

//////////////////////////////////////////
//// Helper Functions for Error Handelling

function sendErrForDev(err, res) {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
}

function sendErrForProd(err, res) {
    // Handle DB Cast Error
    // Exmple : Search for Invalid ID
    err = handleCastErrorDB(err);

    // Handle Duplicate Field Value Error
    // Exmple : Repeating field value for unique field
    err = handleDuplicateFieldsDB(err);

    // Handle Validation Error
    // Exmple : Fail schema validation
    err = handleValidationError(err);

    // Handle JWT Error
    // Exmple : Token Expires, Invalid JWT
    err = handleJWTErrors(err);

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
}

function handleCastErrorDB(err) {
    if (err.name === "CastError") {
        const message = `Invalid >> ${err.path} = "${err.value}"`;
        return new exports.AppError(message, 400);
    }
    return err;
}

function handleDuplicateFieldsDB(err) {
    if (err.code === 11000) {
        const message = `Duplicate field value >> ${JSON.stringify(err.keyValue)}`;
        return new exports.AppError(message, 400);
    }
    return err;
}

function handleValidationError(err) {
    if (err.name === "ValidationError") {
        const message = err.message;
        return new exports.AppError(message, 400);
    }
    return err;
}

function handleJWTErrors(err) {
    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
        message = "Invalid Token Found, Login again to get new token !";
        return new exports.AppError(message, 401);
    }
    // Token Expired
    if (err.name === "TokenExpiredError") {
        message = "Token has been Expired, Login agian to get new token !";
        return new exports.AppError(message, 401);
    }

    return err;
}
