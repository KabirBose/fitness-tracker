const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  workout: {
    type: String,
    required: true,
  },
  time: String,
  reps: Number,
  sets: Number,
  description: String,
  category: String,
});

module.exports = mongoose.model("Exercise", exerciseSchema);
