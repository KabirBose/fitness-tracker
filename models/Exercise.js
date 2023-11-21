const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  workout: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  description: String,
  category: String,
});

module.exports = mongoose.model("Exercise", exerciseSchema);
