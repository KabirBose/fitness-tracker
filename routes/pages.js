const express = require("express");
const router = express.Router();

const WorkoutModel = require("../models/Workout");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/exercises", async (req, res) => {
  try {
    const Workoutlist = await WorkoutModel.find();
    res.render("exercises", { Workoutlist });
  } catch (error) {
    // Handle any errors that occurred during data retrieval
    console.error("Error fetching Workoutlist:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
