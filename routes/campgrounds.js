const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const passport = require("passport");
const middleware = require("../middleware");//dont have to specify index.js because index is a special name for file.

//this is the campgrounds route
router.get("/", function(req, res){
	//get all campgrounds from db
	Campground.find({}, (err, campgrounds) => {
		if(err){
			console.log(err);
		} else {
			//req.user is an object we get from the req object with username and ID.
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});

});

//this is the post route
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let price = req.body.price;
	let description = req.body.description;
	let author =
	{
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name: name, image: image, description: description, price: price, author: author}
	Campground.create(newCampground, (err, campground) => {
		if(err){
			console.log(err);
		} else {

			res.redirect("/campgrounds");
		}
	});

});

//this is the new page that shows form to send data to campgrounds.
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//show route
router.get("/:id", (req, res) => {
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec((err, campground) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: campground});
		}
	});
});

//edit campground routes
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//update campground routes
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect(`/campgrounds/${updatedCampground._id}`);
		}
	});
});

//Destroy Campground Router
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {

	Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
		if(err){
			res.redirect("/campgrounds");
		}
		//this deletes all comments on the removed campground from the database.
		Comment.deleteMany({_id: { $in: removedCampground.comments } }, (err) => {
			if(err){
				console.log(err);
			} else {
				res.redirect("/campgrounds");
			}
		});
	});
});


module.exports = router;
