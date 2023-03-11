const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// middleware to check id if its is correct or not
exports.checlId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkData = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "bad request",
      message: "data missing",
    });
  }
  next();
};

// exports.testing = (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       status: "name missing",
//       message: "pls update name too",
//     });
//   }
//   next();
// };

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length, //will give about number of tours in particular area
    data: {
      tours: tours,
    },
  });
};
exports.getTour = (req, res) => {
  console.log(req.params);

  //   as the id is in string it will convert it into a number
  const id = req.params.id * 1;

  //   will compare the id with our parameters in the url
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
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
