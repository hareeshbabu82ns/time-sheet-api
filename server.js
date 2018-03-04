// BASE SETUP
// =============================================================================

// call the packages we need
var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var morgan = require("morgan");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var passport = require("passport");

app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// required for passport
app.use(
  session({
    secret: "greatpowercomeswithgreatresponsibility", // session secret
    resave: true,
    saveUninitialized: true
  })
);

var port = process.env.PORT || 8081; // set our port

var configDB = require("./config/database.js");

// connect to our database
var mongoose = require("mongoose");
mongoose.connect(configDB.url);

// pass passport for configuration
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

var timeSheetsRouter = require("./app/routes/time-sheet")(app, passport);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get("/", function(req, res) {
  res.json({ message: "API Server!" });
});
router.use(timeSheetsRouter);

// more routes for our API will happen here
app.get("/", (req, res) => {
  res.redirect("/api");
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use("/api", passport.authenticate("jwt"), isLoggedIn, router);

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send(401);
}
// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Server Running on port " + port);
