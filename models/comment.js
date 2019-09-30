const mongoose = require("mongoose");

//setting up the schema to automatically put the username with a comment being
//made.
const commentSchema = new mongoose.Schema({
	author:
	{
		id:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	createdAt: { type: Date, default: Date.now },
	text: String
});

module.exports = mongoose.model("Comment", commentSchema);
