// CRUD operations

const express = require("express");
const router = express.Router();
const WorkoutModel = require("../models/Workout");

router.get("/", async (req, res) => {
  try {
    const workouts = await WorkoutModel.find();
    res
      .json({
        data: workouts,
        message: "workouts fetched successfully",
      })
      .status(200);
  } catch (error) {
    res
      .json({
        message: error.message,
      })
      .status(500);
  }
});
