const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


//This is the landing page
router.get("/", function(req, res){
	res.render("landing");
});


//Auth routes ===========================================================
//register form route
router.get("/register", (req, res) => {
	res.render("register");
});

//creating a new user
router.post("/register", (req, res) => {
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			req.flash("error", err.message);//pass passports err message through flash.
			//return exits the if/else statement.
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", `Welcome to YelpCamp ${user.username}`);
			res.redirect("/campgrounds");
		});
	});
});

//login form
router.get("/login", (req, res) => {
	res.render("login");
});

//post route to login
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req, res) => {});

//logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/campgrounds");
});

module.exports = router;
