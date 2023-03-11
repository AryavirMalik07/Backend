const express = require("express");
const tourController = require("./../controllers/tourController");
const fs = require("fs");

const router = express.Router();

router.param("id", tourController.checlId);
// router.param("/", tourController.checkData);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.checkData, tourController.createTour);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
