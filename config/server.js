// third party libraries
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

// imported modules
const pagesRouter = require("../routes/pages");
const MONGO_URI = require("../config/db");

const app = express();

// middleware
app.use(express.json());
app.use(expressLayouts);
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/javascript", express.static(__dirname + "public/javascript"));
app.set("view engine", "ejs");

mongoose.connect(MONGO_URI);
let mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection error"));
mongoDB.once("open", () => {
  console.log("MongoDB Connected");
});

// routes
app.use("/", pagesRouter);

app.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
