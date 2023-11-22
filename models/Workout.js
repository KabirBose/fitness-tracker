const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    workout: {
      type: String,
      required: true,
    },
    time: String,
    reps: Number,
    sets: Number,
    description: String,
    category: String,
  },
  {
    collection: "workout",
  }
);

module.exports = mongoose.model("Workout", workoutSchema);
