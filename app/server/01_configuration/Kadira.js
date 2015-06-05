Meteor.startup(function () {
	try
	{
		// local settings
		var id = "";
		var secret = "";

		if (Meteor.settings && Meteor.settings.kadira) {
			console.log("Using Production Kadira Settings...");

			id = Meteor.settings.kadira.appId;
			appSecret = Meteor.settings.kadira.secret;
			Kadira.connect(id, secret);
		}
		else {
			console.warn("Kadira is not configured!");
		}

	}
	catch (ex) {
		console.log(ex);
	}
});
