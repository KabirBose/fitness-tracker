// Import third-party libraries
const express = require("express"); // Express.js for building web applications
const mongoose = require("mongoose"); // Mongoose for MongoDB interactions
const expressLayouts = require("express-ejs-layouts"); // Express EJS layouts for view rendering
const methodOverride = require("method-override");

// Import custom modules
const pagesRouter = require("../routes/pages"); // Router for pages
const MONGO_URI = require("../config/db"); // MongoDB URI for database connection

// Create an Express application
const app = express();

// Import the 'path' module for working with file and directory paths
const path = require("path");

// Passport middleware
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");

// Middleware setup
// Parse JSON data in the request body
app.use(express.json());

// Parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: false }));

// For passport authentication
app.use(flash());
app.use(
  session({
    secret: "$ecRetKey_FR_ong_3500",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Use EJS layouts for rendering views
app.use(expressLayouts);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Serve CSS files from the 'public/css' directory
app.use("/css", express.static(path.join(__dirname, "public/css")));

// Serve JavaScript files from the 'public/javascript' directory
app.use(
  "/javascript",
  express.static(path.join(__dirname, "public/javascript"))
);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Connect to MongoDB using the provided URI
mongoose.connect(MONGO_URI);

// MongoDB connection event handlers
let mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection error"));
mongoDB.once("open", () => {
  console.log("MongoDB Connected");
});

// Routes setup
// Use the 'pagesRouter' for handling page-related routes
app.use("https://wide-eyed-wasp-yoke.cyclic.app/", pagesRouter);

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
