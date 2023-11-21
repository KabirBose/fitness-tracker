const express = require("express");
const router = express.Router();

let Workout = require("../models/Exercise");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/exercises", (req, res, next) => {
  try {
    const workoutlist =  Workout.find().exec();
    res.render("exercises"), {
      title: "exercises",
      Workoutlist: workoutlist
    };
}
  catch (err) {
    next(err);
  }});


module.exports = router;
