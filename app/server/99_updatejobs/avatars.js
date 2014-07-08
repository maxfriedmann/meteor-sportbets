Meteor.startup(function()
{
	console.log("Running update job :  001-avatars ");
	
	Meteor.users.find({
		"profile.picture" : undefined
	}).forEach(function(user)
	{
		Meteor.users.update(user, {
			$set : {
				"profile.picture" : "/images/avatars/contractor_128.png"
			}
		});
		console.log("   -- updated user : " + user._id);
	});
});
