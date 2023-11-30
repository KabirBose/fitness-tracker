const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

const UserModel = require("../models/User");
const WorkoutModel = require("../models/Workout");

let _user = {};
const authenticateUser = async (username, password, done) => {
  _user = await UserModel.findOne({ username: username });
  if (_user.username === null) {
    return done(null, false, { message: "No _user with that username" });
  }
  try {
    if (await bcrypt.compare(password, _user.password)) {
      return done(null, _user.username);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  } catch (error) {
    return done(error);
  }
};

passport.use(
  new LocalStrategy({ usernameField: "username" }, authenticateUser)
);
passport.serializeUser((user, done) => {
  // console.log("logged in");
  done(null, _user._id);
});
passport.deserializeUser((id, done) => {
  // console.log("logged out");
  done(null, _user._id);
});

// Render the homepage
router.get("/", (req, res) => {
  res.render("index");
});

// Register new user
router.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    // hashes password using bcryptjs
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new UserModel({
      username: req.body.username,
      password: hashedPassword,
    });
    // Save the new workout to the database
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    res.redirect("/register");
  }
});

// Login user
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/exercises",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  res.render("logout");
});

router.delete("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// Retrieve workout data from the database and render the exercises page
router.get("/exercises", checkAuthenticated, async (req, res) => {
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
router.get("/exercises/new", checkAuthenticated, (req, res) => {
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

// Render the "Edit Workout" page with the selected workout data
router.get("/exercises/edit/:id", checkAuthenticated, async (req, res) => {
  try {
    const workoutId = req.params.id;
    const workout = await WorkoutModel.findById(workoutId);

    // Render the edit page and pass the workout data to the template
    res.render("editWorkout", { workout });
  } catch (error) {
    console.error("Error fetching workout for edit:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle form submission for editing a workout
router.post("/exercises/edit/:id", async (req, res, next) => {
  try {
    let id = req.params.id;

    // Extract data from the form
    let updateWorkout = {
      workout: req.body.workout,
      time: req.body.time,
      reps: req.body.reps,
      sets: req.body.sets,
      description: req.body.description,
      category: req.body.category,
    };

    // Update the document in the database based on the provided ID
    await WorkoutModel.updateOne({ _id: id }, updateWorkout);

    // Redirect to the exercises page after the update
    res.redirect("/exercises");
  } catch (err) {
    // Handle errors
    console.log(err);
    res.status(500).end(err); // Adjust the status code as needed
  }
});

// Handle the delete operation
router.delete("/exercises/delete/:id", checkAuthenticated, async (req, res) => {
  try {
    const workoutId = req.params.id;

    // Delete the workout from the database
    const result = await WorkoutModel.findOneAndDelete({ _id: workoutId });

    // Handle the result of the delete operation
    console.log(result);

    // Send a response indicating successful deletion
    res.redirect("/exercises");
  } catch (error) {
    // Log the error details
    console.error("Error deleting workout:", error);

    // Send a response with the error status and message
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// Export the router to use in other parts of the application
module.exports = router;
