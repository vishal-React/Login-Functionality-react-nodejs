var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./mongoDB");
const session = require("express-session");
const passport = require("passport");

var app = express();
require("./config/passport"); // Load passport config

// Session Middleware (Required for Passport)
app.use(
  session({
    secret: process.env.secretkey, // Secret for signing the session ID
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Import Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
const errorHandler = require("./middlewares/errorHandler");

// View Engine Setup (Only if you're using EJS for some frontend)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter); 

// Handle 404 Errors
app.use((req, res, next) => {
  next(createError(404, "Route Not Found"));
});

// Global Error Handler (Ensures JSON Response)
app.use(errorHandler);

module.exports = app;
