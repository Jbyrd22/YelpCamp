const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const seeds = [
	{
		name: "Giants Toe",
		image: "https://www.beyondthetent.com/wp-content/uploads/2015/06/Amazing-Camping-Photo.jpg",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
	},
	{
		name:"Lizards Leap",
		image: "https://i.ytimg.com/vi/nayJ28609Ek/maxresdefault.jpg",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
	},
	{
		name: "Ice Horse Racing",
		image: "https://i.ytimg.com/vi/E6_IyxxLL-0/maxresdefault.jpg",
		description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
	}
];

const seedDB = () => {
	Campground.remove({}, (err) => {
		if(err){
			console.log(err);
		}
		console.log("Campgrounds removed");

		Comment.remove({}, (err) => {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
    });

		seeds.forEach((seed) => {
			Campground.create(seed, (err, campground) => {
				if(err){
					console.log(err);
				}

				Comment.create({
					author: "Jack Johnson",
					text: "This place is great, but I'm freezing my nuts off!"
				}, (err, comment) => {
					if(err){
						console.log(err);
					} else {
						campground.comments.push(comment);
						campground.save();
						console.log(campground);
					}
				});
			});
		});
	});

}

module.exports = seedDB;

// async function seedDB_2() {
//     try {
//         await Campground.remove({});
//         await Comment.remove({});

//         data.forEach((seed) => {
//             let campground = await Campground.create(seed);
//             let comment = await Comment.create({
//                 text: "This Place is the SHIIITTTTTTT!!",
//                 author: "Jack"
//             });
//             campground.comments.push(comment);
//             await campground.save();
//             console.log("Create a new campground");
//         });
//     } catch {
//         console.error("There has been an error!");
//     }


// }
