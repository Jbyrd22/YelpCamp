const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");
const methodOverride = require("method-override");
const flash = require("connect-flash");

//requiring routes
const campgroundRoutes = require("./routes/campgrounds"),
	  	commentRoutes = require("./routes/comments"),
	  	authRoutes = require("./routes/index");


//seedDB(); //removed the seeds for now
//set environment variable DATABASEURL to local database, and on heroku for heroku database.
//use the keyword "set" on windows command prompt.(set DATABASEURL=<url>)
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());//must come before passport configuration!!!



//==========================================================================
//Passport configuration
//===========================================================================

app.use(require("express-session")({
	secret: "Gatlin is the best dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this allows the req.user data to be passed to every route and template under the name 'currentUser'.
//this allows currentUser and message to be used on every route/template automatically
app.use((req, res, next) => {
	res.locals.currentUser = req.user;//current user object for authentication
	res.locals.error = req.flash("error");//flash message
	res.locals.success = req.flash("success");//flash message
	next();
});

//must be beneath currentUser code
//allows different files with routes to be used and also shortens the parameters
//by declaring the commonalities of each while being called.
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//=========================================================================

const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("YelpCamp server has started!");
});
