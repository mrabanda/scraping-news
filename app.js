const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
// const logger = require("morgan");
const mongoose = require("mongoose");
const routes = require('./routes/router');

const port = process.env.PORT || 3000;
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
const app = express();

// app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/scrapenews");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

app.use(routes);

// Listen on port 3000
app.listen(port, function () {
  console.log("App running on port 3000!");
});
