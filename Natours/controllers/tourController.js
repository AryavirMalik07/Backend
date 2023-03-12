const fs = require("fs");
const Tour = require("./../models/tourModel");
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// middleware to check id if its is correct or not

// ********We comment out this because now mongoDB will check the ID validity
// exports.checlId = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

// exports.checkData = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "bad request",
//       message: "data missing",
//     });
//   }
//   next();
// };

// exports.testing = (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       status: "name missing",
//       message: "pls update name too",
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      // results: tours.length, //will give about number of tours in particular area
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }

  //   will compare the id with our parameters in the url
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
  // 1st way of creating data
  // const newTour = new Tour({});
  // newTour.save();

  // 2nd way of creating
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated data>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
