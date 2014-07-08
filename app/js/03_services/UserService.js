UserService = {};

/**
 * This method most likely only works on the server
 */
UserService.getMailAddress = function(userId)
{
	var user = Meteor.users.findOne({
		"_id" : userId
	});
	if (!user)
	{
		console.log("Could not find a user for returning mail address!");
		return undefined;
	}
	
	// first, username/password signup address
	if (user.emails instanceof Array && user.emails.length > 0)
	{
		return user.emails[0].address;
	}
	
	// facebook
	if (user.services && user.services.facebook && user.services.facebook.email)
	{
		return user.services.facebook.email;
	}
	
	// google
	if (user.services && user.services.google && user.services.google.email)
	{
		return user.services.google.email;
	}
	
	return undefined;
};
