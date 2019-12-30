const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const passport = require("passport");
const middleware = require("../middleware");//dont have to specify index.js because index is a special name for file.
const NodeGeocoder = require("node-geocoder");
require('dotenv').config();//must have on every page that you use the .env file.

let options = {
	provider: 'google',
	httpAdapter: "https",
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
};

let geocoder = NodeGeocoder(options);

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

	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		console.log(err.message);
		req.flash('error', 'Invalid address');
		return res.redirect('back');
		}
		let lat = data[0].latitude;
		let lng = data[0].longitude;
		let location = data[0].formattedAddress;
		let newCampground = {name: name, image: image, description: description, price: price, author: author, location: location, lat: lat, lng: lng};
		Campground.create(newCampground, (err, campground) => {
			if(err){
				console.log(err);
			} else {

				res.redirect("/campgrounds");
			}
		});
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
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
			console.error(err);
      req.flash('error', 'Invalid address');
			return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
			if(err){
				res.redirect("/campgrounds");
			} else {
				res.redirect(`/campgrounds/${updatedCampground._id}`);
			}
		});
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
				req.flash("success", "Campground Deleted!");
				res.redirect("/campgrounds");
			}
		});
	});
});


module.exports = router;
