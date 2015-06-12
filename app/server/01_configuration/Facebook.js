Meteor.startup(function()
{
	Accounts.loginServiceConfiguration.remove({
		service : "facebook"
	});
	
	// localhost settings
	var appId = "none";
	var secret = "none";
	
	// env settings
	if (Meteor.settings && Meteor.settings.facebook)
	{
		appId = Meteor.settings.facebook.appId;
		secret = Meteor.settings.facebook.secret;
		
		Accounts.loginServiceConfiguration.insert({
		service : "facebook",
		"appId" : appId,
		"secret" : secret
		});
		console.log("Facebook settings applied!");
	}
	
	
	
	
});
