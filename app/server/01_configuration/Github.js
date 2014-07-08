Meteor.startup(function()
{
	Accounts.loginServiceConfiguration.remove({
		service : "github"
	});
	
	// localhost settings
	var clientId = "none";
	var secret = "none";
	
	// env settings
	if (Meteor.settings && Meteor.settings.github)
	{
		clientId = Meteor.settings.github.clientId;
		secret = Meteor.settings.github.secret;
	}
	
	Accounts.loginServiceConfiguration.insert({
		service : "github",
		"clientId" : clientId,
		"secret" : secret
	});
	
	console.log("Github settings applied!");
});
