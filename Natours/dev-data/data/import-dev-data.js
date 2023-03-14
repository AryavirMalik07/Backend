const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("database connected");
  });

//   read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("data successfully loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DElete all data from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("data deleted successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
// adding data in our db

// const testTour = new Tour({
//   name: "the uttarPradesh hicker",
//   rating: 4.7,
//   price: 510,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
