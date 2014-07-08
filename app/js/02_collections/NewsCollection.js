News = new Meteor.Collection("news");

if (Meteor.isServer)
{
	Meteor.publish("lastTenNews", function()
	{
		subscriptionLogging("lastTenNews");
		
		return News.find({}, {
			limit : 10,
			sort : {
				date : -1
			}
		});
	});
}
