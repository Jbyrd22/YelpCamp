const express = require("express");
//mergeParams: true, allows the :id to be passed through to these comment
//routes from the app.js page.
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const passport = require("passport");
const middleware = require("../middleware");//dont have to specify index.js because index is a special name for file.


//comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});


//comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
	const comment = req.body.comment;
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err){
			console.log(err);
		} else {
			Comment.create(comment, (err, newComment) => {
				if(err){
					res.send(err);
				} else {
					//add username to comment
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					//save comment
					newComment.save();
					//push comment into campground and save campground.
					foundCampground.comments.push(newComment);
					foundCampground.save();
					req.flash("success", "Successfully added comment");
					res.redirect(`/campgrounds/${foundCampground._id}`)
				}

			});
		}
	});
});

//edit route that shows form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//update route for comments
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//delete route for comments
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err){
			console.log(err);
			res.redirect(`/campgrounds/${req.params.id}`);
		} else {
			req.flash("success", "comment removed!!");
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});


module.exports = router;
