const express = require("express");
const router = express.Router();

const WorkoutModel = require("../models/Workout");

// Render the homepage
router.get("/", (req, res) => {
  res.render("index");
});

// Retrieve workout data from the database and render the exercises page
router.get("/exercises", async (req, res) => {
  try {
    // Fetch all workouts from the database
    const Workoutlist = await WorkoutModel.find();

    // Render the exercises page and pass the workout data to the template
    res.render("exercises", { Workoutlist });
  } catch (error) {
    // Handle any errors that occurred during data retrieval
    console.error("Error fetching Workoutlist:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Render the "Add New Workout" page
router.get("/exercises/new", (req, res) => {
  res.render("addWorkout");
});

// Handle form submission for adding a new workout
router.post("/exercises/new", async (req, res) => {
  try {
    // Log the form data received from the request
    console.log("Form data:", req.body);

    // Extract data from the form
    const { workout, time, reps, sets, description, category } = req.body;

    // Create a new workout instance using the form data
    const newWorkout = new WorkoutModel({
      workout: workout || "", // Handle undefined values
      time: time || "",
      reps: reps || 0, // Assuming reps and sets are numeric
      sets: sets || 0,
      description: description || "",
      category: category || "",
    });

    // Save the new workout to the database
    await newWorkout.save();

    // Redirect back to the exercises page after adding the new workout
    res.redirect("/exercises");
  } catch (error) {
    // Handle any errors that occurred during form submission
    console.error("Error adding new workout:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Export the router to use in other parts of the application

module.exports = router;