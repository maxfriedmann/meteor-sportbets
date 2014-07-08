Meteor.startup(function()
{
	Accounts.loginServiceConfiguration.remove({
		service : "twitter"
	});
	
	// localhost settings
	var consumerKey = "JwJOAsKP1sICzF9Fq8FIOUTZZ";
	var secret = "JpS9N0fJGw8lemdxzNbB96KOPJjVv0emHkymCupCLKcFkkmAVl";
	
	// env settings
	if (Meteor.settings && Meteor.settings.twitter)
	{
		consumerKey = Meteor.settings.twitter.consumerKey;
		secret = Meteor.settings.twitter.secret;
	}
	
	Accounts.loginServiceConfiguration.insert({
		service : "twitter",
		"consumerKey" : consumerKey,
		"secret" : secret
	});
	
	console.log("Twitter settings applied!");
});
