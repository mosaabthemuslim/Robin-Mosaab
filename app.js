const express = require("express");
const homeRouter = require("./routes/homeRouter");
const userRouter = require("./routes/userRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
////////////////
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const limiter = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanities = require("express-mongo-sanitize");
///////////////////
const app = express();
app.use(helmet());
app.use(cookieParser());
const limit = limiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "You reached your limit from this IP adress",
});
// limit requists
app.use("/robin", limit);
app.use(express.json({ limit: "10kb" }));
///////////////////////////
// data sanatisation protuction
app.use(mongoSanities());
// prevent xss atacks
app.use(xss());

app.use("/robin/v1/home", homeRouter);
app.use("/robin/v1/user", userRouter);
app.use("*", (req, res, next) => {
  next(
    new AppError(`can't find the url ${req.originalUrl} in this server`),
    404
  );
});
//////////////////
app.use(globalErrorHandler);
module.exports = app;
