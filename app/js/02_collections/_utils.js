subscriptionLogging = function(subName)
{
	if (Meteor.settings.developerMode)
		console.log("Subscribing to " + subName);
};
