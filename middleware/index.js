const Campground = require("../models/campground");
const Comment = require("../models/comment");

// all middleware goes here
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err || !foundCampground){
        req.flash("error", "Campground Not Found");
				res.redirect("back");
			} else {
				//does user own campground?
				//use built in equals method that comes with mongoose.
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();//steps on to the next callback function where middleware is called.
				} else {
          req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
    req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");//takes user back one page.
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err || !foundComment){
        res.redirect("back");
      } else {
        //does user own comment?
        //use built in equals method that comes with mongoose.
        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
          next();//steps on to the next callback function where middleware is called.
        } else {
          req.flash("error", "Not authorized for this!!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");//takes user back one page.
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
		return next();
	}
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
}

module.exports = middlewareObj;
