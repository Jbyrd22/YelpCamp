const mongoose = require("mongoose");

//Schema setup
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	createdAt: { type: Date, default: Date.now },
	location: String,
	lat: Number,
	lng: Number,
	price: String,
	author:
	{
		id:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
//create Campground object with mongoose methods built in.
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
