const express = require("express");
const userRoutes = require("./../controllers/userController");
const route = express.Router();
route.route("/").get(userRoutes.getAllUsers).post(userRoutes.createUser);
route
  .route("/:id")
  .get(userRoutes.getUser)
  .patch(userRoutes.updateUser)
  .delete(userRoutes.deleteUser);

module.exports = route;
