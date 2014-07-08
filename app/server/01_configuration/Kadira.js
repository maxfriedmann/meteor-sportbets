Meteor.startup(function()
{
	try
	{
		// local settings
		var id = "";
		var secret = "";
		
		if (Meteor.settings && Meteor.settings.kadira)
		{
			console.log("Using Production Kadira Settings...");
			
			id = Meteor.settings.kadira.appId;
			appSecret = Meteor.settings.kadira.secret;
		}
		else
		{
			console.log("Using Local Kadira Settings...");
		}
		
		Kadira.connect(id, secret);
	}
	catch (ex)
	{
		console.log(ex);
	}
});
