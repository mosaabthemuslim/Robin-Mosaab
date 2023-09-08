const AppError = require("./../utils/appError");
/////////////////
const handleExpiredToken = function () {
  return new AppError("Your token expired please log in", 401);
};
const handleTokenError = function () {
  return new AppError("Invalid Token Please log in again", 401);
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    err,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "TokenExpiredError") error = handleExpiredToken();
    if (err.name === "JsonWebTokenError") error = handleTokenError();
    ////////////////////
    sendErrorProd(error, res);
  }
};
