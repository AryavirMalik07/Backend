const express = require("express");

const morgan = require("morgan");
const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1ST MIDDLEWARE
app.use(morgan("dev"));

app.use(express.static(`${__dirname}/public`));

app.use(express.json()); //middleware

app.use((req, res, next) => {
  console.log("hello middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

app.listen(3001, () => {
  console.log("port on 3001");
});

module.exports = app;
