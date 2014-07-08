if (Meteor.isServer)
{
	Meteor.publish("allUsers", function()
	{
		var users = Meteor.users.find({}, {
			fields : {
				"profile.online" : 1,
				"profile.picture" : 1,
				"nickname" : 1,
				"language" : 1,
				"administrator" : 1,
				"services.facebook.id" : 1,
				"tutorials" : 1
			}
		});
		console.log("subscribing to allUsers, returning " + users.count() + " records!");
		return users;
	});
	
	Meteor.publish("onlineUsers", function()
		{
			var users = Meteor.users.find({}, {
				fields : {
					"profile.online" : 1
				}
			});
			return users;
		});
	
	Meteor.publish("player", function(id)
	{
		return Meteor.users.find({
			_id : id
		}, {
			fields : {
				"profile.online" : 1,
				"profile.picture" : 1,
				"nickname" : 1
			}
		});
	});
	
	Meteor.publish("myPlayer", function()
	{
		var users = Meteor.users.find({
			"_id" : this.userId
		}, {
			fields : {
				"profile.online" : 1,
				"profile.picture" : 1,
				"nickname" : 1,
				"language" : 1,
				"administrator" : 1,
				"services.facebook.id" : 1,
				"tutorials" : 1
			}
		});
		console.log("subscribing to myPlayer, returning " + users.count() + " records!");
		return users;
	});
}
