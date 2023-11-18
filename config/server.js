// third party libraries
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");

// imported modules
const pagesRouter = require("../routes/pages");

const app = express();

// middleware
app.use("/", pagesRouter);
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use("/css", express.static(__dirname + "public/css"));
app.use("/javascript", express.static(__dirname + "public/javascript"));

app.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
