Meteor.startup(function()
{
	Accounts.loginServiceConfiguration.remove({
		service : "google"
	});
	
	// localhost settings
	var clientId = "";
	var secret = "";
	
	// env settings
	if (Meteor.settings && Meteor.settings.google)
	{
		clientId = Meteor.settings.google.clientId;
		secret = Meteor.settings.google.secret;
	}
	
	Accounts.loginServiceConfiguration.insert({
		service : "google",
		"clientId" : clientId,
		"secret" : secret
	});
	
	console.log("Google settings applied!");
});
