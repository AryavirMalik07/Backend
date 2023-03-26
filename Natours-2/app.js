const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1ST MIDDLEWARE
// security HTTP header
app.use(helmet());
app.use(morgan("dev"));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP,try again later",
});

app.use("/api", limiter);

// Body parser, reading data from body into the req.body

app.use(express.static(`${__dirname}/public`));

app.use(
  express.json({
    limit: "10kb",
  })
); //middleware

app.use((req, res, next) => {
  console.log("hello middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

app.listen(3001, () => {
  console.log("port on 3001");
});

module.exports = app;
